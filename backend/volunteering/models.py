from django.db import models
from django.conf import settings
from django.utils import timezone


class VolunteeringCategory(models.Model):
    """Categories for volunteering activities."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#F59E0B')  # Hex color
    points_per_hour = models.FloatField(default=1.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'volunteering_categories'
        verbose_name = 'Volunteering Category'
        verbose_name_plural = 'Volunteering Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class VolunteeringActivity(models.Model):
    """Student volunteering activities model."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='volunteering_activities')
    title = models.CharField(max_length=200)
    description = models.TextField()
    organization = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey(VolunteeringCategory, on_delete=models.CASCADE, related_name='activities')
    activity_date = models.DateField()
    hours_volunteered = models.FloatField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    points = models.PositiveIntegerField(default=0)
    evidence_url = models.URLField(blank=True)
    evidence_file = models.FileField(upload_to='volunteering/evidence/', blank=True, null=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='verified_volunteering'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    skills_developed = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'volunteering_activities'
        verbose_name = 'Volunteering Activity'
        verbose_name_plural = 'Volunteering Activities'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.title}"
    
    def save(self, *args, **kwargs):
        # Calculate points based on hours and category
        if not self.points:
            self.points = int(self.hours_volunteered * self.category.points_per_hour)
        super().save(*args, **kwargs)
    
    def approve(self, verified_by):
        """Approve the volunteering activity."""
        self.status = 'approved'
        self.verified_by = verified_by
        self.verified_at = timezone.now()
        self.save()
        
        # Update user profile
        profile = self.user.profile
        profile.volunteering_hours += self.hours_volunteered
        profile.total_points += self.points
        profile.save()
    
    def reject(self, verified_by, reason):
        """Reject the volunteering activity."""
        self.status = 'rejected'
        self.verified_by = verified_by
        self.verified_at = timezone.now()
        self.rejection_reason = reason
        self.save()


class VolunteeringComment(models.Model):
    """Comments on volunteering activities."""
    
    activity = models.ForeignKey(VolunteeringActivity, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal comments for faculty/admin
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'volunteering_comments'
        verbose_name = 'Volunteering Comment'
        verbose_name_plural = 'Volunteering Comments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.activity.title}"


class VolunteeringLike(models.Model):
    """Likes on volunteering activities."""
    
    activity = models.ForeignKey(VolunteeringActivity, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'volunteering_likes'
        verbose_name = 'Volunteering Like'
        verbose_name_plural = 'Volunteering Likes'
        unique_together = ['activity', 'user']
    
    def __str__(self):
        return f"{self.user.full_name} likes {self.activity.title}"


class VolunteeringShare(models.Model):
    """Volunteering activity sharing tracking."""
    
    activity = models.ForeignKey(VolunteeringActivity, on_delete=models.CASCADE, related_name='shares')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    platform = models.CharField(max_length=50)  # linkedin, twitter, facebook, etc.
    shared_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'volunteering_shares'
        verbose_name = 'Volunteering Share'
        verbose_name_plural = 'Volunteering Shares'
    
    def __str__(self):
        return f"{self.user.full_name} shared {self.activity.title} on {self.platform}"


class VolunteeringOpportunity(models.Model):
    """Volunteering opportunities posted by organizations."""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('completed', 'Completed'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    organization = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    category = models.ForeignKey(VolunteeringCategory, on_delete=models.CASCADE, related_name='opportunities')
    start_date = models.DateField()
    end_date = models.DateField()
    required_hours = models.FloatField()
    max_volunteers = models.PositiveIntegerField(null=True, blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=15, blank=True)
    requirements = models.TextField(blank=True)
    benefits = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    is_featured = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_opportunities')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'volunteering_opportunities'
        verbose_name = 'Volunteering Opportunity'
        verbose_name_plural = 'Volunteering Opportunities'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.organization} - {self.title}"


class VolunteeringApplication(models.Model):
    """Applications for volunteering opportunities."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    
    opportunity = models.ForeignKey(VolunteeringOpportunity, on_delete=models.CASCADE, related_name='applications')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='volunteering_applications')
    motivation = models.TextField()
    relevant_experience = models.TextField(blank=True)
    available_hours = models.FloatField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='reviewed_applications'
    )
    review_notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'volunteering_applications'
        verbose_name = 'Volunteering Application'
        verbose_name_plural = 'Volunteering Applications'
        unique_together = ['opportunity', 'user']
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.opportunity.title}"


class VolunteeringImpact(models.Model):
    """Track the impact of volunteering activities."""
    
    activity = models.ForeignKey(VolunteeringActivity, on_delete=models.CASCADE, related_name='impacts')
    metric_name = models.CharField(max_length=100)  # e.g., "People Helped", "Trees Planted"
    metric_value = models.PositiveIntegerField()
    metric_unit = models.CharField(max_length=50)  # e.g., "people", "trees", "hours"
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'volunteering_impacts'
        verbose_name = 'Volunteering Impact'
        verbose_name_plural = 'Volunteering Impacts'
    
    def __str__(self):
        return f"{self.activity.title} - {self.metric_name}: {self.metric_value} {self.metric_unit}"
