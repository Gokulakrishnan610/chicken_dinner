from django.db import models
from django.conf import settings
from django.utils import timezone


class AchievementCategory(models.Model):
    """Categories for achievements."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    points_multiplier = models.FloatField(default=1.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'achievement_categories'
        verbose_name = 'Achievement Category'
        verbose_name_plural = 'Achievement Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Achievement(models.Model):
    """Student achievements model."""
    
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
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(AchievementCategory, on_delete=models.CASCADE, related_name='achievements')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    points = models.PositiveIntegerField(default=0)
    evidence_url = models.URLField(blank=True)
    evidence_file = models.FileField(upload_to='achievements/evidence/', blank=True, null=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='verified_achievements'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    skills_gained = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'achievements'
        verbose_name = 'Achievement'
        verbose_name_plural = 'Achievements'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.title}"
    
    def approve(self, verified_by):
        """Approve the achievement."""
        self.status = 'approved'
        self.verified_by = verified_by
        self.verified_at = timezone.now()
        self.save()
        
        # Update user profile
        profile = self.user.profile
        profile.achievements_count += 1
        profile.total_points += self.points
        profile.save()
    
    def reject(self, verified_by, reason):
        """Reject the achievement."""
        self.status = 'rejected'
        self.verified_by = verified_by
        self.verified_at = timezone.now()
        self.rejection_reason = reason
        self.save()


class AchievementComment(models.Model):
    """Comments on achievements."""
    
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal comments for faculty/admin
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'achievement_comments'
        verbose_name = 'Achievement Comment'
        verbose_name_plural = 'Achievement Comments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.achievement.title}"


class AchievementLike(models.Model):
    """Likes on achievements."""
    
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'achievement_likes'
        verbose_name = 'Achievement Like'
        verbose_name_plural = 'Achievement Likes'
        unique_together = ['achievement', 'user']
    
    def __str__(self):
        return f"{self.user.full_name} likes {self.achievement.title}"


class AchievementShare(models.Model):
    """Achievement sharing tracking."""
    
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='shares')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    platform = models.CharField(max_length=50)  # linkedin, twitter, facebook, etc.
    shared_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'achievement_shares'
        verbose_name = 'Achievement Share'
        verbose_name_plural = 'Achievement Shares'
    
    def __str__(self):
        return f"{self.user.full_name} shared {self.achievement.title} on {self.platform}"


class AchievementBadge(models.Model):
    """Badges for special achievements."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#FFD700')
    criteria = models.JSONField(default=dict)  # Criteria for earning the badge
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'achievement_badges'
        verbose_name = 'Achievement Badge'
        verbose_name_plural = 'Achievement Badges'
    
    def __str__(self):
        return self.name


class UserBadge(models.Model):
    """User earned badges."""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(AchievementBadge, on_delete=models.CASCADE, related_name='users')
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_badges'
        verbose_name = 'User Badge'
        verbose_name_plural = 'User Badges'
        unique_together = ['user', 'badge']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.badge.name}"
