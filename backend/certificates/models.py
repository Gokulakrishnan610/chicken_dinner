from django.db import models
from django.conf import settings
from django.utils import timezone


class CertificateCategory(models.Model):
    """Categories for certificates."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#10B981')  # Hex color
    points_value = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificate_categories'
        verbose_name = 'Certificate Category'
        verbose_name_plural = 'Certificate Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Certificate(models.Model):
    """Student certificates model."""
    
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
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificates')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(CertificateCategory, on_delete=models.CASCADE, related_name='certificates')
    issuer = models.CharField(max_length=200)
    issue_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    certificate_number = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    points = models.PositiveIntegerField(default=0)
    certificate_file = models.FileField(upload_to='certificates/', blank=True, null=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='verified_certificates'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    skills_verified = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_public = models.BooleanField(default=True)
    is_expired = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'certificates'
        verbose_name = 'Certificate'
        verbose_name_plural = 'Certificates'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.title}"
    
    def save(self, *args, **kwargs):
        # Check if certificate is expired
        if self.expiry_date and self.expiry_date < timezone.now().date():
            self.is_expired = True
        else:
            self.is_expired = False
        super().save(*args, **kwargs)
    
    def approve(self, verified_by):
        """Approve the certificate."""
        self.status = 'approved'
        self.verified_by = verified_by
        self.verified_at = timezone.now()
        self.save()
        
        # Update user profile
        profile = self.user.profile
        profile.certificates_count += 1
        profile.total_points += self.points
        profile.save()
    
    def reject(self, verified_by, reason):
        """Reject the certificate."""
        self.status = 'rejected'
        self.verified_by = verified_by
        self.verified_at = timezone.now()
        self.rejection_reason = reason
        self.save()


class CertificateReview(models.Model):
    """Certificate review process."""
    
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    review_notes = models.TextField()
    is_approved = models.BooleanField()
    reviewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificate_reviews'
        verbose_name = 'Certificate Review'
        verbose_name_plural = 'Certificate Reviews'
        ordering = ['-reviewed_at']
    
    def __str__(self):
        return f"{self.certificate.title} - {self.reviewer.full_name}"


class CertificateComment(models.Model):
    """Comments on certificates."""
    
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal comments for faculty/admin
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificate_comments'
        verbose_name = 'Certificate Comment'
        verbose_name_plural = 'Certificate Comments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.certificate.title}"


class CertificateLike(models.Model):
    """Likes on certificates."""
    
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificate_likes'
        verbose_name = 'Certificate Like'
        verbose_name_plural = 'Certificate Likes'
        unique_together = ['certificate', 'user']
    
    def __str__(self):
        return f"{self.user.full_name} likes {self.certificate.title}"


class CertificateShare(models.Model):
    """Certificate sharing tracking."""
    
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='shares')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    platform = models.CharField(max_length=50)  # linkedin, twitter, facebook, etc.
    shared_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificate_shares'
        verbose_name = 'Certificate Share'
        verbose_name_plural = 'Certificate Shares'
    
    def __str__(self):
        return f"{self.user.full_name} shared {self.certificate.title} on {self.platform}"


class CertificateTemplate(models.Model):
    """Templates for generating certificates."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    template_file = models.FileField(upload_to='certificate_templates/')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificate_templates'
        verbose_name = 'Certificate Template'
        verbose_name_plural = 'Certificate Templates'
    
    def __str__(self):
        return self.name


class CertificateVerification(models.Model):
    """Certificate verification requests."""
    
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='verifications')
    verifier_email = models.EmailField()
    verification_code = models.CharField(max_length=20, unique=True)
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificate_verifications'
        verbose_name = 'Certificate Verification'
        verbose_name_plural = 'Certificate Verifications'
    
    def __str__(self):
        return f"{self.certificate.title} - {self.verifier_email}"
