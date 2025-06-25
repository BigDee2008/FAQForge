import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateFaqSchema, type GenerateFaqRequest, type FaqQuestion } from "@shared/schema";
import { Copy, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface GeneratedFaq {
  id: number;
  questions: FaqQuestion[];
  htmlCode: string;
  cssCode: string;
}

export default function FaqGenerator() {
  const [generatedFaq, setGeneratedFaq] = useState<GeneratedFaq | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const form = useForm<GenerateFaqRequest>({
    resolver: zodResolver(generateFaqSchema),
    defaultValues: {
      businessType: "",
      businessDescription: "",
      websiteUrl: "",
      faqStyle: "accordion",
    },
  });

  const generateFaqMutation = useMutation({
    mutationFn: async (data: GenerateFaqRequest) => {
      const response = await apiRequest("POST", "/api/generate-faq", data);
      return response.json() as Promise<GeneratedFaq>;
    },
    onSuccess: (data) => {
      setGeneratedFaq(data);
      setExpandedQuestions(new Set([0]));
      toast({
        title: "FAQ Generated Successfully!",
        description: "Your FAQ section is ready. You can now copy the code.",
      });
    },
    onError: (error) => {
      console.error("FAQ generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate FAQ. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GenerateFaqRequest) => {
    generateFaqMutation.mutate(data);
  };

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type} code copied to clipboard.`,
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    });
  };

  const businessTypes = [
    "E-commerce Store",
    "SaaS Platform", 
    "Service Business",
    "Restaurant/Food",
    "Healthcare",
    "Education",
    "Other"
  ];

  return (
    <div className="p-8">
      <Card className="shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-8 border-r border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">Business Description</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          rows={6}
                          placeholder="Describe your business, products/services, target audience, and any specific topics you want covered in the FAQ..."
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="url"
                          placeholder="https://yourwebsite.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="faqStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FAQ Style</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-3"
                        >
                          <Label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                            <RadioGroupItem value="accordion" className="text-primary" />
                            <span className="ml-2 text-sm">Accordion</span>
                          </Label>
                          <Label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                            <RadioGroupItem value="simple" className="text-primary" />
                            <span className="ml-2 text-sm">Simple List</span>
                          </Label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={generateFaqMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 font-semibold hover:opacity-90 transition-all"
                >
                  {generateFaqMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Generating FAQ with AI...
                    </span>
                  ) : (
                    "Generate FAQ with AI"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="p-8 bg-muted">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Generated FAQ</h3>
              {generatedFaq && (
                <Button 
                  onClick={() => copyToClipboard(generatedFaq.htmlCode + '\n\n' + generatedFaq.cssCode, 'Complete')}
                  className="flex items-center space-x-2 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </Button>
              )}
            </div>
            
            {generatedFaq ? (
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">HTML Code</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="mt-4">
                  <Card className="max-h-96 overflow-y-auto">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {generatedFaq.questions.map((faq, index) => (
                          <div key={index} className="border-b border-border pb-4 last:border-b-0">
                            <button 
                              onClick={() => toggleQuestion(index)}
                              className="flex justify-between items-center w-full text-left"
                            >
                              <h4 className="font-medium text-foreground">{faq.question}</h4>
                              {expandedQuestions.has(index) ? (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              )}
                            </button>
                            {expandedQuestions.has(index) && (
                              <div className="mt-3 text-muted-foreground text-sm">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="code" className="mt-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg">
                        <span className="text-gray-300 text-sm">HTML</span>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedFaq.htmlCode, 'HTML')}
                          className="text-gray-400 hover:text-white text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="max-h-64 overflow-auto">
                        <SyntaxHighlighter 
                          language="html" 
                          style={oneDark}
                          customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                        >
                          {generatedFaq.htmlCode}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg">
                        <span className="text-gray-300 text-sm">CSS</span>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedFaq.cssCode, 'CSS')}
                          className="text-gray-400 hover:text-white text-xs"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="max-h-64 overflow-auto">
                        <SyntaxHighlighter 
                          language="css" 
                          style={oneDark}
                          customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                        >
                          {generatedFaq.cssCode}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    {generateFaqMutation.isPending 
                      ? "Generating your FAQ..." 
                      : "Fill out the form and click generate to see your FAQ preview here."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
