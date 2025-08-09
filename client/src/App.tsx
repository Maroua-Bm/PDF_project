import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Search, ChevronUp, ChevronDown, X, Sparkles } from 'lucide-react';
import { Toaster } from "sonner";
import { toast } from "sonner";

// Utility function
const cn = (...classes: (string | undefined | null | false | Record<string, boolean>)[]): string => {
  return classes
    .map(cls => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, condition]) => condition)
          .map(([className]) => className)
          .join(' ');
      }
      return cls;
    })
    .filter(Boolean)
    .join(' ');
};

// Card component
const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props}>
    {children}
  </div>
);

// Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

// Badge component
const Badge = ({ children, className, variant = 'default' }: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};

// File Upload Component
const FileUpload = ({ onFileSelect, isLoading }: {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    disabled: isLoading
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'relative overflow-hidden transition-all duration-300 cursor-pointer',
        'border-2 border-dashed p-12 text-center',
        'hover:border-primary hover:shadow-card',
        {
          'border-primary bg-primary/5': isDragAccept,
          'border-destructive bg-destructive/5': isDragReject,
          'border-accent shadow-glow': isDragActive && isDragAccept,
          'cursor-not-allowed opacity-50': !!isLoading,
        }
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className={cn(
            'rounded-full p-6 transition-all duration-300',
            isDragActive && isDragAccept 
              ? 'bg-gradient-accent text-accent-foreground' 
              : 'bg-gradient-primary text-primary-foreground'
          )}>
            {isLoading ? (
              <FileText className="h-12 w-12 animate-pulse" />
            ) : (
              <Upload className={cn(
                'h-12 w-12 transition-transform duration-300',
                isDragActive && 'scale-110'
              )} />
            )}
          </div>
          {!isLoading && (
            <div className="absolute -inset-2 rounded-full bg-gradient-primary opacity-20 blur-lg animate-pulse-glow" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {isLoading ? 'Processing PDF...' : 'Upload PDF Document'}
          </h3>
          <p className="text-muted-foreground max-w-md">
            {isLoading 
              ? 'Please wait while we prepare your document for searching'
              : 'Drag and drop your PDF file here, or click to browse'
            }
          </p>
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              Supports PDF files up to 50MB
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// Search Interface Component
interface SearchResult {
  search_query: string;
  total_matches: number;
  matched_sentences: string[];
  highlighted_pdf: string;
}

const SearchInterface = ({ onSearch, searchResult, isSearching, onClear }: {
  onSearch: (query: string) => void;
  searchResult?: SearchResult;
  isSearching?: boolean;
  onClear?: () => void;
}) => {
  const [query, setQuery] = useState('');
  const [currentMatch, setCurrentMatch] = useState(1);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setCurrentMatch(1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchResult && currentMatch < searchResult.total_matches) {
        setCurrentMatch(prev => prev + 1);
      } else {
        handleSearch();
      }
    }
  };

  const nextMatch = () => {
    if (searchResult && currentMatch < searchResult.total_matches) {
      setCurrentMatch(prev => prev + 1);
    }
  };

  const prevMatch = () => {
    if (currentMatch > 1) {
      setCurrentMatch(prev => prev - 1);
    }
  };

  const handleClear = () => {
    setQuery('');
    setCurrentMatch(1);
    onClear?.();
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for words or phrases in the document..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-10 h-12 text-base"
              disabled={isSearching}
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button 
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="px-6 h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>

        {searchResult && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                {searchResult.total_matches} {searchResult.total_matches === 1 ? 'match' : 'matches'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                for "{searchResult.search_query}"
              </span>
            </div>
            
            {searchResult.total_matches > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {currentMatch} of {searchResult.total_matches}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevMatch}
                    disabled={currentMatch <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextMatch}
                    disabled={currentMatch >= searchResult.total_matches}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {searchResult && searchResult.matched_sentences.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Matched Sentences:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {searchResult.matched_sentences.slice(0, 5).map((sentence, index) => (
                <div
                  key={index}
                  className={cn(
                    'text-xs p-2 rounded border-l-2 bg-muted/50',
                    index === currentMatch - 1 
                      ? 'border-accent bg-accent/10' 
                      : 'border-muted'
                  )}
                >
                  {sentence}
                </div>
              ))}
              {searchResult.matched_sentences.length > 5 && (
                <div className="text-xs text-muted-foreground text-center py-1">
                  +{searchResult.matched_sentences.length - 5} more matches
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// PDF Viewer Component
const PDFViewer = ({ pdfUrl, fileName }: {
  pdfUrl?: string;
  fileName?: string;
}) => {
  if (!pdfUrl) {
    return (
      <Card className="flex-1 flex items-center justify-center p-12 bg-muted/20">
        <div className="text-center space-y-4">
          <div className="rounded-full p-6 bg-muted inline-flex">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">No PDF Selected</h3>
            <p className="text-muted-foreground">Upload a PDF document to get started</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        {fileName && (
          <div className="px-4 py-3 border-b bg-muted/20">
            <h3 className="font-medium text-foreground truncate">{fileName}</h3>
          </div>
        )}
        <div className="flex-1 relative">
        <iframe
   src={pdfUrl}
   className="w-full min-h-[1000px] h-[80vh] border-0 rounded-b-lg"
   title="PDF Viewer"
/>

        </div>
      </div>
    </Card>
  );
};

// Main App Component
const App = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  // 👇 New summarization handler (mock API)
const handleSummarize = async () => {
  if (!selectedFile) {
    toast.error("Please upload a PDF first.");
    return;
  }

  const formData = new FormData();
  formData.append("pdf", selectedFile);

  setIsSummarizing(true);
  setSummary(null);

  try {
    const res = await fetch("http://localhost:5001/api/pdf/summarize", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to summarize: ${errorText}`);
    }

    const data = await res.json();
    setSummary(data.summary);
  } catch (err) {
    console.error("Error summarizing document:", err);
    setSummary("Error: Unable to summarize the document.");
  } finally {
    setIsSummarizing(false);
  }
};

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setSelectedFile(file);
    
    // Create a URL for the original PDF to display
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    
    setIsUploading(false);
    toast.success(`${file.name} uploaded successfully! Ready for searching.`);
  };

  const handleSearch = async (query: string) => {
    if (!selectedFile) {
      toast.error("Please upload a PDF file first.");
      return;
    }

    setIsSearching(true);
    
    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('query', query);

      // Replace with your backend URL
      const response = await fetch('http://localhost:5001/api/pdf/search', 
        {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const result = await response.json();
      setSearchResult(result);
      setPdfUrl(result.highlighted_pdf); // <-- Update viewer to show highlighted PDF

      toast.success(`Found ${result.total_matches} ${result.total_matches === 1 ? 'match' : 'matches'} for "${query}".`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("An error occurred while searching the PDF. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchResult(null);
    // Reset PDF viewer to original file
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPdfUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-12">
          {/* Animated PDF Icon + Title */}
    <div className="flex flex-col items-center justify-center gap-4 text-center">
  {/* Row: Icon + Title */}
  <div className="flex items-center justify-center gap-4">
    <div className="animate-float bg-gradient-primary p-6 rounded-full shadow-md">
      <FileText className="h-14 w-14 text-primary-foreground animate-pulse" />
    </div>
    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      PDF Search & Summarizer
    </h1>
  </div>

  {/* Description */}
  <p className="text-lg text-muted-foreground max-w-2xl">
    Upload your PDF and easily search or summarize its content with intelligent features.
  </p>
</div>

       {/* Feature icons (optional - you can remove this block if not needed) */}
    <div className="flex items-center justify-center gap-8 pt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4 text-primary" />
        <span>PDF Upload</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-accent" />
        <span>Auto Highlight</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-success" />
        <span>Summarization</span>
      </div>
    </div>      
        </div>

        {/* Main Interface */}
        <div className="max-w-7xl mx-auto">
          {!selectedFile ? (
            /* Upload Section */
            <div className="max-w-2xl mx-auto">
              <FileUpload 
                onFileSelect={handleFileSelect} 
                isLoading={isUploading}
              />
            </div>
          ) : (
            /* Search and View Section */
            <div className="space-y-6">
              <SearchInterface
                onSearch={handleSearch}
                searchResult={searchResult || undefined}
                isSearching={isSearching}
                onClear={handleClearSearch}
              />
              
<Button
  onClick={handleSummarize}
  disabled={isSummarizing || !selectedFile}
  className="bg-gradient-to-r from-accent to-primary text-black hover:opacity-90"
>
  {isSummarizing ? "Summarizing..." : "Summarize Document"}
</Button>



              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
                {/* PDF Viewer */}
                <div className="lg:col-span-2">
                  <PDFViewer 
                    pdfUrl={pdfUrl} 
                    fileName={selectedFile.name}
                  />
                </div>
                
                {/* Sidebar */}
                <div className="space-y-4">
                  <div className="bg-card p-4 rounded-lg border shadow-soft">
                    <h3 className="font-semibold text-foreground mb-2">Document Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File:</span>
                        <span className="font-medium truncate ml-2">{selectedFile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">PDF</span>
                      </div>
                    </div>
                  </div>

                  {searchResult && (
                    <div className="bg-card p-4 rounded-lg border shadow-soft">
                      <h3 className="font-semibold text-foreground mb-3">Search Results</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-accent">{searchResult.total_matches}</span>
                          <span className="text-sm text-muted-foreground">
                            {searchResult.total_matches === 1 ? 'match found' : 'matches found'}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd> to navigate between results
                        </div>
                      </div>
                    </div>
                  )}


                  {/* 👇 ADD THIS SUMMARY BLOCK HERE */}
  {summary && (
    <div className="bg-card p-4 rounded-lg border shadow-soft">
      <h3 className="font-semibold text-foreground mb-2">Document Summary</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
        {summary}
      </p>
    </div>
  )}


                  <div className="bg-card p-4 rounded-lg border shadow-soft">
                    <h3 className="font-semibold text-foreground mb-2">Quick Tips</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Search for exact phrases using quotes</li>
                      <li>• Use Enter to navigate between results</li>
                      <li>• Results are highlighted in the PDF</li>
                      <li>• Upload a new file to start over</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Upload New File Button */}
              <div className="text-center pt-6">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPdfUrl('');
                    setSearchResult(null);
                  }}
                  className="px-6 py-2 text-sm text-primary hover:text-primary-glow underline underline-offset-4 transition-colors"
                >
                  Upload a different PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;