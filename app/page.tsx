import Image from "next/image"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Download,
  ExternalLink,
  BookOpen,
  Code,
  Award,
  Briefcase,
  User,
  GraduationCap,
  FileText,
  MessageSquare,
  ChevronUp,
  Link as LinkIcon,
  Braces,
} from "lucide-react"

import ContactForm from "@/components/contact-form"
import Navigation from "@/components/navigation"
import {SiDatacamp} from "react-icons/si";
import { Phone } from 'lucide-react';
import { Separator } from "@radix-ui/react-dropdown-menu"


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-bold">
            Ateeb Shahid
          </Link>
          <div className="flex items-center gap-4">
            <Navigation />
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container pb-16">
        {/* Hero Section */}
        <section id="hero" className="py-20 md:py-28 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Ateeb Shahid</h1>
            <h2 className="text-xl md:text-2xl font-medium text-muted-foreground">Automation Engineer | RPA / IPA Engineer</h2>
            <p className="text-muted-foreground max-w-md">
              Passionate about creating intuitive and impactful digital experiences. Interest and focused on Automation, Data Science, machine learning and AI.
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild>
                <a href="#contact">Get in touch</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#projects">View projects</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://drive.google.com/file/d/1g2F3bo5wj3FBvUo1TQ6ppK7EK5aZke9H/view?usp=sharing" target="_blank">My Resume</a>
              </Button>
            </div>
            
            {/*Follow Linkedin button*/}
            <div className="flex gap-4 pt-2">
              <Button variant="outline" asChild>
              <a href="https://www.linkedin.com/in/ateeb-shahid/" target="_blank" className="flex items-center gap-1">
                <Linkedin className="h-4 w-4" />
                <span>Follow LinkedIn</span>
              </a>
              </Button>
            
            {/*Follow Github button*/}
              <Button variant="outline" asChild>
              <a href="https://github.com/teebs339" target="_blank" className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                <span>Follow GitHub</span>
              </a>
              </Button>
            </div>

          </div>
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-background shadow-xl">
            <Image src={process.env.NODE_ENV === 'production' ? '/portfolio/pfp.png' : '/pfp.png'} alt="Jane Doe" fill className="object-cover" priority />
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="py-16 scroll-mt-16">
          <div className="flex items-center gap-2 mb-8">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <p>
                I'm an Automation and Machine Learning Engineer with a passion for building intelligent systems that simplify complex workflows. My journey in technology started with a curiosity for how automation and AI can enhance human productivity. Over time, I've developed expertise in RPA, process optimization, and intelligent automation using tools like UiPath, Power Automate, and n8n, combined with Python and Node.js to deliver innovative, data-driven solutions.
              </p>
              <p>
                I aim to leverage my technical skills to create impactful solutions that address real-world challenges.
                I'm particularly interested in the intersection of technology and healthcare, where I believe innovative
                software can make a significant difference.
              </p>
              <p>
                When I'm not coding, you can find me hiking in the mountains, in gym, swimming pool, pulling 
                strings on a guitar or performing backflips on a trampoline. 
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-medium">Location:</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Dubai, UAE</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Education:</span>
                  <div className="text-muted-foreground">B.S. Computer Science</div>
                </div>
                <div>
                  <span className="font-medium">Interests:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary">Intelligent Automation</Badge>
                    <Badge variant="secondary">Data Science</Badge>
                    <Badge variant="secondary">Machine Learning</Badge>
                    <Badge variant="secondary">AI</Badge>
                    <Badge variant="secondary">LLMs</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-16 scroll-mt-16">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
          </div>

          <Card className="border-none shadow-none">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>AI Automation Engineer</CardTitle>
                  <CardDescription>Upwork (Hybrid)</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <Badge>Jan 2025 - Aug 2025</Badge>
                  <span className="text-xs text-muted-foreground mt-1 mr-1">8 months</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground">
                  Delivered AI-driven RPA/IPA solutions as a freelancer for global clients across SAP MM, SD, and FI/CO processes. Built end-to-end automations using UiPath, Power Automate, Blue Prism, Automation Anywhere, n8n, Zapier, Make.com, Python, Node.js, REST APIs, and CRMs (Zoho, GHL, Salesforce, HubSpot). Earned Upwork <strong>Top Rated badge</strong> with <strong>100% Job Success</strong>, completing 20+ projects with consistent 5-star reviews.
                </p>
                <hr className="h-px bg-gray-200 dark:bg-gray-500 border-0 my-3" />
                <ul className="list-disc list-inside text-muted-foreground space-y-0">
                  <li>Delivered tailored AI automation solutions for international clients across multiple industries, including SAP MM, SD and FI/CO processes.</li>
                  <li>Used RPA tools such as UiPath, Power Automate, Blue Prism, Automation Anywhere and web tools such as N8N, Zapier, Make.com, Retools to develop custom automated solutions.</li>
                  <li>Achieved Upwork Top Rated status with 100% Job Success and 5-star client reviews.</li>
                  <li>Completed 20+ projects for clients all over the world including US, UK, EU and Middle East.</li>
                  <li>Built bots and integrations using UiPath, Power Automate, Python (Selenium), Node.js (Puppeteer) and ML Model Qwen, Docker/Ollama, REST APIs and CRM platforms like Zoho, GoHighLevel (GHL), SalesForce and HubSpot.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm uppercase tracking-wide text-primary">Tools & Technologies</h4>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> UiPath</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                   <span> Automation Anywhere</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                   <span> Power Automate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                      <span> Selenium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> Puppeteer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> n8n</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> Make.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> Zapier</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm uppercase tracking-wide text-primary">Programming Languages</h4>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>Python</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>JavaScript</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>VB.NET</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>SQL</span>
                  </li>
                </ul>
              </div>

            </CardContent>
          </Card>

        <hr className="h-px bg-gray-200 dark:bg-gray-500 border-0 my-3" />

          <Card className="border-none shadow-none">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Lead RPA/IPA Developer</CardTitle>
                  <CardDescription>Lahore, Pakistan (On-site)</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <Badge>Oct 2023 - Jan 2025</Badge>
                  <span className="text-xs text-muted-foreground mt-1 mr-1">15 months</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground">
                  At Sybros Tech, a technology consulting firm specializing in <strong>Robotic Process Automation (RPA)</strong> and <strong>Intelligent Process Automation (IPA)</strong>, I led the RPA team in designing and deploying automation solutions across SAP Fiori and HANA, streamlining finance, procurement, and sales operations. Oversaw developer training, guided project execution, and represented Sybros Tech as a speaker in university workshops. Delivered scalable automations using UiPath, Power Automate, Python, and API integrations, showcasing the company's leadership in enterprise automation.
                </p>
                <hr className="h-px bg-gray-200 dark:bg-gray-500 border-0 my-3" />
                <ul className="list-disc list-inside text-muted-foreground space-y-0">
                  <li>Experienced in SAP Fiori and SAP HANA environments, including data extraction, reporting, and process automation.</li>
                  <li>Led a team of 5 developers to deliver high-quality automation projects across all modules.</li>
                  <li>Received a LinkedIn recommendation from the CEO of SybrosTech, recognizing professionalism, problem-solving, teamwork, and reliability.</li>
                  <li>Designed and implemented end-to-end RPA solutions using UiPath, Power Automate, Python, and API integrations for SAP and non-SAP systems.</li>
                  <li>Conducted process analysis, data mining, and workflow optimization leveraging SAP HANA's real-time processing capabilities.</li>
                  <li>Automated SAP HANA data queries and reporting for finance, procurement, and sales operations, reducing manual effort and errors.</li>
                  <li>Managed full project lifecycle, ensuring timely delivery and adherence to quality standards.</li>
                  <li>Experienced with tools and platforms: Postman, Node.js (Puppeteer), Python (Selenium), Google Apps Script, Salesforce, HubSpot, Zapier, Make.com, n8n, MongoDB.</li>
                  <li>Trained and mentored junior developers and conducted university workshops on RPA, automation, and SAP process integration.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm uppercase tracking-wide text-primary">Tools & Technologies</h4>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> UiPath/Orchestrator</span>
                   </li>
                  <li className="flex items-center gap-2">
                   <Braces className="h-4 w-4 text-primary"/>
                   <span> Power Automate/Power Apps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> Selenium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> Twilio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> ML Models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> LLMs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> Postman</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> BeautifulSoup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> MongoDB</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary"/>
                    <span> n8n</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm uppercase tracking-wide text-primary">Programming Languages</h4>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>Python</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>JavaScript</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>VB.NET</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>SQL</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span>PHP</span>
                  </li>
                </ul>
              </div>

            </CardContent>
          </Card>

        </section>

        {/* Education Section */}
        <section id="education" className="py-16 scroll-mt-16">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Education</h2>
          </div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>University of Central Punjab (UCP)</CardTitle>
                  <CardDescription>Lahore, Pakistan</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                <Badge>Jun 2019 - Jul 2023</Badge>
                <span className="text-xs text-muted-foreground mt-1 mr-1">4 years</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Bachelor of Science in Computer Science</h3>
                <p className="text-muted-foreground">GPA: 2.91/4.0</p>
              </div>
              <div>
                <h4 className="font-medium">Relevant Coursework</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Data Structures & Algorithms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Data Analysis and Algorithms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Generative AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Artificial Intelligence</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
            <hr className="h-px bg-gray-200 dark:bg-gray-500 border-0 my-3" />
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Punjab Group of Colleges (PGC)</CardTitle>
                  <CardDescription>Lahore, Pakistan</CardDescription>
                </div>
                <div className="flex flex-col items-end">
                <Badge>May 2017 - Mar 2019</Badge>
                <span className="text-xs text-muted-foreground mt-1 mr-1">2 years</span>
                </div>
              </div>
              
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {/* Education Section */}
                <h3 className="font-medium">Intermediate in Computer Sciences (ICS)</h3>
              </div>
              <div>
                <h4 className="font-medium">Relevant Subjects</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Maths</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Physics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Computer Science</span>
                  </li>

                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 scroll-mt-16">
          <div className="flex items-center gap-2 mb-8">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            

            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={process.env.NODE_ENV === 'production' ? '/portfolio/unity-logo.png' : '/unity-logo.png'}
                  alt="cognify"
                  fill
                  className="object-contain transition-all duration-300 group-hover:scale-110" />
              </div>
              <CardHeader>
                <CardTitle>Final Year Project - Free Flow Learning</CardTitle>
                <CardDescription>An Oculus Meta Quest 2 App based on C#/Unity3D
              </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Built an immersive Oculus Meta Quest VR app using Unity 3D based on C# programming language. Leveraged XR Libraries to simulate accurate in app interaction and collision physics. Connected MySQL database for score keeping properties.
                </p>
                <div>
                  <h4 className="text-sm font-medium mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Meta Quest 2</Badge>
                    <Badge variant="outline">C#</Badge>
                    <Badge variant="outline">MySQL</Badge>
                    <Badge variant="outline">XR</Badge>
                    <Badge variant="outline">Unity3D</Badge>
                    <Badge variant="outline">Oculus</Badge>
                    <Badge variant="outline">Rendering/Vizualization</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://github.com/teebs339/FYP-Free-Flow-Learning" target="_blank" className="flex items-center gap-1">
                      <Github className="h-4 w-4" />
                      <span>Code</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={process.env.NODE_ENV === 'production' ? '/portfolio/video-transcribe-rpa.png' : '/video-transcribe-rpa.png'}
                  alt="video-transcribe-RPA"
                  fill
                  className="object-contain transition-all duration-300 group-hover:scale-110" />
              </div>
              <CardHeader>
                <CardTitle>Video Transcribe RPA</CardTitle>
                <CardDescription>End-to-End Media Automation Pipeline
              </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Built an automated RPA pipeline using Python and UiPath/VB.NET to fetch videos from Google Sheets and MagicBrief, extract frames and audio, generate transcripts via Whisper API, and upload outputs to Miro, optimized for scalable, low-intervention VM deployment.
                </p>
                <div>
                  <h4 className="text-sm font-medium mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">UiPath</Badge>
                    <Badge variant="outline">RPA</Badge>
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">VB.NET</Badge>
                    <Badge variant="outline">OpenAI Whisper</Badge>
                    <Badge variant="outline">Miro</Badge>
                    <Badge variant="outline">pandas</Badge>
                    <Badge variant="outline">moviepy</Badge>
                    <Badge variant="outline">Virtual Machine (VM)</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://github.com/teebs339/Video-Transcribe-RPA" target="_blank" className="flex items-center gap-1">
                      <Github className="h-4 w-4" />
                      <span>Code</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>          

            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={process.env.NODE_ENV === 'production' ? '/portfolio/FMCSA.png' : '/FMCSA.png'}
                  alt="FMCSA Backend Data Extractor RPA"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>FMCSA Backend Data Extractor RPA</CardTitle>
                <CardDescription>Extract data from HTML request, classifying using RegEx</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Developed an RPA bot to automatically scrape and process FMCSA backend data, parse it into structured Excel reports using RegEx, and format outputs with VBA. Built a dynamic workflow driven by MX/US DOT numbers while ensuring compliance with public FMCSA datasets.
                </p>
                <div>
                  <h4 className="text-sm font-medium mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">RPA</Badge>
                    <Badge variant="outline">UiPath</Badge>
                    <Badge variant="outline">Excel VBA</Badge>
                    <Badge variant="outline">RegEx</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://github.com/teebs339/FMCSA-Backend-Data-Extractor" target="_blank" className="flex items-center gap-1">
                      <Github className="h-4 w-4" />
                      <span>Code</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* Achievements & Awards Section */}
        <section id="achievements" className="py-16 scroll-mt-16">
          <div className="flex items-center gap-2 mb-8">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Achievements & Awards</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">


            <Card>
              <CardHeader>
                <CardTitle>RPA Team Lead</CardTitle>
                <CardDescription>Sybros Tech, Lahore</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Led the RPA team to deliver enterprise automations across SAP platforms, optimizing workflows and boosting efficiency. Mentored developers and earned a formal LinkedIn recommendation from the CEO for leadership and technical excellence.
                </p>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://www.linkedin.com/in/ateeb-shahid/" target="_blank" className="flex items-right gap-1">
                      <ExternalLink className="h-4 w-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Rated Freelancer</CardTitle>
                <CardDescription>Upwork</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Delivered 20+ AI-driven automation projects globally using RPA/IPA, web automation, Python/Node.js, ML models, Docker, and CRMs. Achieved Top Rated freelancer badge in no time with 100% Job Success Score.
                </p>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://www.upwork.com/freelancers/~018029074a06d605ab" target="_blank" className="flex items-right gap-1">
                      <ExternalLink className="h-4 w-4" />
                      <span>Upwork Profile</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conducted RPA Workshop at University of Management & Technology (UMT)</CardTitle>
                <CardDescription>Representing SybrosTech as a TL</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  UMT's Department of AI hosted an RPA workshop in collaboration with Sybros Tech. On May 3, 2024, an MoU was signed to offer student internships. Workshop led by CEO <strong>Maaz Tariq</strong> & <strong>TL Ateeb Shahid</strong>, Sybros Tech is a pioneering RPA company in Pakistan, aiming to drive impactful collaboration in automation.
                </p>

                <div className="flex gap-2">
                  {/* First button */}
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href="https://www.facebook.com/SSTUMTofficial/posts/pfbid0BqiUZLoGXsBh3EtbrmE4YTKzH5f7M5DoBKeYtMBCmkqMva9qpiNZzTWVAPyFPsdBl?rdid=zdE5DEPz1xLNUwBv#"
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>View Post 1</span>
                    </a>
                  </Button>

                  {/* Second button */}
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href="https://www.facebook.com/SSTUMTofficial/posts/pfbid02P9CE7mTX1qCsrVoS8SPE6m2jm5B3teDnxhniXdepmyBv3scfnrKQMDfC5BbY8gpJl"
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>View Post 2</span>
                    </a>
                  </Button>
                </div>

                
              </CardContent>
            </Card>

          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 scroll-mt-16">
          <div className="flex items-center gap-2 mb-8">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
          </div>

          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="technical">Technical Skills</TabsTrigger>
              <TabsTrigger value="soft">Soft Skills</TabsTrigger>
            </TabsList>
            <TabsContent value="technical" className="mt-6">
              <div className="grid gap-8 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Programming Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Python</Badge>
                      <Badge>VB.NET</Badge>
                      <Badge>C#</Badge>
                      <Badge>C/C++</Badge>
                      <Badge>HTML/CSS</Badge>
                      <Badge>SQL</Badge>
                      <Badge>JavaScript</Badge>
                      <Badge>PHP</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Frameworks & Libraries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge>HuggingFace</Badge>
                      <Badge>OpenAI</Badge>
                      <Badge>Numpy</Badge>  
                      <Badge>moviepy</Badge>
                      <Badge>Pandas</Badge>
                      <Badge>Flask</Badge>
                      <Badge>Selenium</Badge>
                      <Badge>BeautifulSoup</Badge>
                      <Badge>OpenCV</Badge>
                      <Badge>OpenAI</Badge>
                      <Badge>Ollama</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tools & Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge>UiPath</Badge>
                      <Badge>Power Automate</Badge>
                      <Badge>Automation Anywhere</Badge>
                      <Badge>n8n</Badge>
                      <Badge>Make.com</Badge>
                      <Badge>Zapier</Badge>
                      <Badge>Retool</Badge>
                      <Badge>HighLevel (GHL)</Badge>
                      <Badge>SalesForce</Badge>
                      <Badge>HubSpot</Badge>
                      <Badge>ClickUp</Badge>
                      <Badge>PhotoShop</Badge>
                      <Badge>Cursor</Badge>
                      <Badge>Git & GitHub</Badge>
                      <Badge>AWS</Badge>
                      <Badge>CI/CD</Badge>
                      <Badge>Google Cloud</Badge>
                      <Badge>Postman</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Databases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge>MongoDB</Badge>
                      <Badge>MySQL</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="soft" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Excellent written and verbal communication skills. Experienced in presenting technical concepts to
                      both technical and non-technical audiences. Skilled in documentation and technical writing.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Problem Solving</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Strong analytical thinking and creative problem-solving abilities. Capable of breaking down
                      complex problems into manageable components and developing effective solutions.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Teamwork</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Collaborative team player with experience working in diverse groups. Sharp leadership & decision making capabilities. Comfortable giving and
                      receiving feedback, and adapting to different team dynamics and work styles.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Leadership Qualities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Excellent at prioritizing tasks and relegating to the team. Adept at meeting deadlines and managing multiple projects simultaneously.
                      Experienced with agile methodologies and project management tools.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-16 scroll-mt-16">
          <div className="flex items-center gap-2 mb-8">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Certifications</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


            <Card>
              <CardHeader>
                <CardTitle>Machine Learning with TensorFlow on Google cloud</CardTitle>
                <CardDescription>Udemy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge>Nov 2024</Badge>
                <div className="flex">
                  <Button variant="link" size="sm" className="px-0" asChild>
                    <a href="http://ude.my/UC-95616298-c95a-4c29-80e4-cff99ad8a6c3" target="_blank" className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      <span>View Certification</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 scroll-mt-16">
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Contact</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Fill out the form and I'll get back to you as soon as possible.</CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Feel free to reach out through any of these channels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="teeb.shahid@gmail.com" className="hover:underline">
                    teeb.shahid@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Dubai, United Arab Emirates</span>
                </div>
                <div className="pt-4">
                  <h3 className="font-medium mb-3">Connect with me</h3>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon" asChild>
                      <a href="https://www.linkedin.com/in/ateeb-shahid/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href="https://github.com/teebs339" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>

                    <Button variant="outline" size="icon" asChild>
                      <a href="tel:+971506771450" aria-label="Phone">
                        <Phone className="h-5 w-5" />
                      </a>
                    </Button>

                    
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="https://drive.google.com/file/d/1g2F3bo5wj3FBvUo1TQ6ppK7EK5aZke9H/view?usp=sharing" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Download Resume</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="#hero" className="scroll-smooth" aria-label="Back to top">
                <ChevronUp className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
