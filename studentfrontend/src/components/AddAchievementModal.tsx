import { useState, useEffect } from "react";
import { X, Upload, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAchievementCategories } from "@/hooks/useApi";

interface AddAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  achievement?: any;
  onUpdate?: (id: number, data: any) => void;
}

const AddAchievementModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  achievement, 
  onUpdate 
}: AddAchievementModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    points: "",
    skills: "",
    evidence_file: null as File | null,
    evidence_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useAchievementCategories();
  
  // Debug logging
  useEffect(() => {
    console.log('Achievement Categories:', { categoriesData, categoriesLoading, categoriesError });
  }, [categoriesData, categoriesLoading, categoriesError]);

  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title || "",
        description: achievement.description || "",
        category: achievement.category?.toString() || "",
        points: achievement.points?.toString() || "",
        skills: achievement.skills?.join(", ") || "",
        evidence_file: null,
        evidence_url: achievement.evidence_url || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        points: "",
        skills: "",
        evidence_file: null,
        evidence_url: "",
      });
    }
  }, [achievement, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert skills string to array
      const skillsArray = formData.skills ? 
        formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : 
        [];

      const achievementData = {
        title: formData.title,
        description: formData.description,
        category: parseInt(formData.category),
        priority: "medium" as const,
        points: parseInt(formData.points) || 0,
        evidence_url: formData.evidence_url || undefined,
        evidence_file: formData.evidence_file || undefined,
        skills_gained: skillsArray,
        tags: [],
        is_public: true,
      };

      if (achievement && onUpdate) {
        onUpdate(achievement.id, achievementData);
      } else {
        onSubmit(achievementData);
      }
    } catch (error) {
      console.error('Error submitting achievement:', error);
      toast({
        title: "Error",
        description: "Failed to submit achievement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, evidence_file: file }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {achievement ? "Edit Achievement" : "Add New Achievement"}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., AWS Cloud Practitioner"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                    ) : categoriesError ? (
                      <SelectItem value="error" disabled>Error loading categories</SelectItem>
                    ) : categoriesData && Array.isArray(categoriesData) && categoriesData.length > 0 ? (
                      categoriesData.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your achievement..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points *</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                  placeholder="50"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="React, JavaScript, Frontend (comma separated)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence_url">Evidence URL</Label>
              <Input
                id="evidence_url"
                value={formData.evidence_url}
                onChange={(e) => setFormData(prev => ({ ...prev, evidence_url: e.target.value }))}
                placeholder="https://example.com/certificate"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence_file">Evidence File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="evidence_file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload PDF, JPG, or PNG files (max 10MB)
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : achievement ? "Update Achievement" : "Add Achievement"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AddAchievementModal;
