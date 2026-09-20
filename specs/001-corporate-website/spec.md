# Feature Specification: U Design Corporate Website

**Feature Branch**: `001-corporate-website` (spec directory; the project is not yet a git repository)

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Create the complete product specification for the U Design corporate
website based on the project constitution. Define WHAT the website must provide, WHO it serves, WHY
each major capability exists, and WHAT a successful user experience looks like." (Full brief
supplied with the `/speckit-specify` command covers the product, audience, page-by-page
requirements, content tone, and success criteria.)

## Overview

U Design (tagline **Build. Market. Grow.**) is a B2B digital solutions and digital marketing
company. The website's purpose is to **generate qualified B2B leads**, with particular emphasis on
corporate and manufacturing clients seeking custom business software.

The website presents two connected service categories under one brand:

- **Business Software & Digital Solutions**: Custom Software Development, ERP Systems, CRM
  Solutions, Business Dashboards, Workflow Automation, Business Process Digitalization.
- **Digital Marketing & Growth**: Social Media Marketing, Social Media Management, Content
  Creation, Meta Ads, Lead Generation, Performance Marketing, Digital Strategy.

**Target users**: Business Owners, CEOs / Managing Directors, Operations Managers, IT Managers,
and Marketing Decision Makers at corporate businesses, manufacturers, established SMEs,
distributors, and logistics, construction, real estate, travel, healthcare, and retail companies.

**Core user problem**: Businesses run key processes on spreadsheets, paper, WhatsApp, manual
reporting, and disconnected tools with no central visibility, and they also need stronger digital
marketing and lead generation. The site must show that U Design addresses both.

**Core journey**: Discover → understand what U Design does → identify industry or need → explore
relevant solutions → view examples → understand how U Design works → build trust → request a
consultation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand U Design and Request a Consultation from the Home Page (Priority: P1)

A business owner or CEO arrives on the home page (from search, social media, an ad, or a referral).
Within a few seconds they understand that U Design builds custom business software and provides
digital marketing, that it works with businesses like theirs, and how to get started. They scroll
through the home page, recognize their own operational problems in the "Still Managing Your
Business With Spreadsheets?" section, and request a free consultation.

**Why this priority**: The home page is the primary landing point and the main lead source. The
home page plus a working consultation request is the minimum viable website.

**Independent Test**: Publish only the home page and the consultation request. A first-time visitor
can explain what U Design does, who it serves, and how to start, then submit a consultation request
that U Design receives.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on the home page, **When** the page loads on any device,
   **Then** without scrolling they see the tagline "Build. Market. Grow.", the headline "Digital
   Solutions That Help Businesses Grow", the supporting message, a "Get Free Consultation" primary
   CTA, and a "View Our Solutions" secondary CTA.
2. **Given** the hero is visible, **When** the visitor looks at the hero visual, **Then** it
   represents both business software and dashboards/analytics and digital marketing in the style of
   a premium technology product, not generic agency artwork.
3. **Given** the visitor scrolls the home page, **When** they reach each section, **Then** they
   encounter, in a logical order: trust (client logos, if available), the two service categories,
   industries, software showcase, the spreadsheet-to-software digitalization journey, the six-step
   process, digital marketing, Why U Design, and a closing consultation CTA.
4. **Given** the visitor reaches the digitalization section, **When** they read it, **Then** they
   see the journey Manual Processes → Centralized Business Software → Real-Time Business Visibility
   and a "Discuss Your Business Process" CTA that leads to the consultation request.
5. **Given** the visitor selects "Get Free Consultation" anywhere on the home page, **When** the
   action completes, **Then** they reach the consultation form without losing their place in an
   unrecoverable way.
6. **Given** no verified client logos have been provided, **When** the home page is published,
   **Then** the "Trusted by Growing Businesses" section is hidden (not filled with placeholder or
   fictional logos).

---

### User Story 2 - Submit a Consultation Request (Priority: P1)

A decision maker who has decided to engage fills in a professional consultation form (Name,
Company, Email, Phone, Industry, What they need, Budget range, Message), submits it, and receives
clear confirmation. U Design receives the request reliably. The form is reachable from multiple
relevant locations: the header CTA on every page, home page sections, solution, industry,
portfolio, and marketing pages, and the Contact page.

**Why this priority**: The consultation request is the site's primary conversion. Without it, the
site cannot meet its core objective.

**Independent Test**: From any page, reach the form, submit valid data, and confirm that both the
visitor sees a success confirmation and U Design receives the complete request. Submit invalid
data and confirm that clear, field-level errors appear.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they select "Get Free Consultation", **Then** they
   reach the consultation form in one action.
2. **Given** the form is displayed, **When** the visitor reviews it, **Then** each field has a
   visible label, required fields are clearly indicated, and Industry, What they need, and Budget
   range offer predefined choices.
3. **Given** the visitor arrived from a specific industry, solution, or project page, **When** the
   form opens, **Then** the related Industry or "What they need" choice is pre-selected and can be
   changed.
4. **Given** valid input, **When** the visitor submits, **Then** they see a clear confirmation that
   the request was received and what happens next (e.g., expected response timeframe), and U Design
   receives every submitted field.
5. **Given** invalid or missing required input (e.g., malformed email), **When** the visitor
   submits, **Then** the form is not sent, each problem is described next to its field, and focus
   moves to the first error. Previously entered values are kept.
6. **Given** submission fails for a reason outside the visitor's control, **When** the failure
   occurs, **Then** the visitor sees a helpful message, their entered data is preserved, they can
   retry, and an alternative contact method (email/phone, when provided) is displayed.
7. **Given** a visitor double-clicks submit, **When** the request is processed, **Then** only one
   request is recorded.

---

### User Story 3 - Explore My Industry (Priority: P2)

An operations manager at a textile manufacturer wants to know whether U Design understands
manufacturing. From the home page industries section or the Industries menu, they open the
Manufacturing page, read about challenges they recognize (production, inventory, raw materials,
purchasing, sales, warehouse, reporting, management dashboards), see suitable solutions and a
related Manufacturing ERP showcase, and request a consultation with Manufacturing pre-selected.

**Why this priority**: Industry relevance is the strongest trust signal for B2B buyers, and
manufacturing is the priority acquisition segment.

**Independent Test**: Publish the Industries overview plus the Manufacturing page. A manufacturing
visitor can find the page within two actions from the home page, recognize their workflows, view a
related project, and request a consultation.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page or any page, **When** they open Industries, **Then** they
   see all launched industries (initial set: Manufacturing, Distribution, Real Estate,
   Construction, Logistics, Travel & Tourism, Healthcare, Retail), each with a short description
   of its key workflows.
2. **Given** the visitor opens an industry page, **When** they read it, **Then** it contains, in
   this order or an equally logical order: common business challenges, relevant workflows,
   suitable software solutions, important features, business benefits, relevant portfolio or demo
   projects, and a consultation CTA.
3. **Given** two different industry pages, **When** compared, **Then** their challenges,
   workflows, and features are specific to each industry, not the same text with the industry name
   swapped.
4. **Given** an industry has no related project yet, **When** the page is displayed, **Then** the
   related projects area is omitted or links to the general portfolio. It does not display
   unrelated projects as if they were relevant.
5. **Given** the Manufacturing page, **When** reviewed, **Then** it covers production management,
   inventory, raw materials, purchasing, sales, warehouse, reporting, and management dashboards.

---

### User Story 4 - Explore Software Solutions (Priority: P2)

An IT manager evaluating options opens the Solutions hub, compares the software capabilities
(Custom Software, ERP, CRM, Business Dashboards, Workflow Automation), opens the ERP solution page,
understands the business benefits and typical features, sees related projects and industries, and
requests a consultation.

**Why this priority**: The Solutions hub answers "Can U Design build this?" and supports
commercial-intent search traffic (e.g., custom ERP development, CRM development).

**Independent Test**: Publish the Solutions hub and at least one solution page. A visitor can reach
a solution page from the main navigation, understand its business value without technical
knowledge, and request a consultation.

**Acceptance Scenarios**:

1. **Given** a visitor selects Solutions in the main navigation, **When** the hub loads, **Then**
   it presents each software solution category with a one-line business benefit and a link to its
   dedicated page.
2. **Given** a solution page, **When** read by a non-technical decision maker, **Then** it
   explains the business problem, how the solution helps, typical features, suitable industries,
   related projects (when available), how U Design works, and a consultation CTA. Business value
   comes before technical detail.
3. **Given** any solution page, **When** reviewed, **Then** it conveys that software is custom-built
   around the client's workflow, not a generic ready-made product.

---

### User Story 5 - Review Proof of Capability in the Portfolio (Priority: P2)

A managing director wants evidence before engaging. They open the Portfolio, filter or browse by
industry or solution type, open the Manufacturing ERP project, and read the business challenge,
solution, features, and business application with interface screenshots. They can tell whether
it's a concept/demo or a real client project.

**Why this priority**: Demonstrated capability converts skeptical B2B buyers. It depends on
available project material.

**Independent Test**: Publish the portfolio with the three initial showcase projects. A visitor can
open each, understand problem → solution → features → business application, and see its
concept/demo or client status.

**Acceptance Scenarios**:

1. **Given** the Portfolio page, **When** it loads, **Then** each project shows its name, industry,
   type label (Concept/Demo or Client Project), and a short summary.
2. **Given** a project detail page, **When** opened, **Then** it presents Problem (business
   challenge) → Solution → Features → Business Application, with interface screenshots that each
   have explanatory context.
3. **Given** a project is a concept/demo, **When** displayed anywhere on the site (portfolio, home
   showcase, industry page), **Then** it is labeled as a concept/demo and shows no client name,
   client logo, or results.
4. **Given** a client project without verified results, **When** displayed, **Then** the results
   area is omitted.
5. **Given** the initial showcase, **When** reviewed, **Then** it includes Manufacturing ERP
   (Textile Manufacturing: Executive Dashboard, Production, Inventory, Purchase, Sales, Reports),
   Travel Agency Management (Dashboard, Customers, Leads, Packages, Bookings, Visa Processing,
   Payments, Reports), and Real Estate CRM (Dashboard, Leads, Customers, Properties, Site Visits,
   Bookings, Installments, Reports).
6. **Given** the portfolio has more projects than fit on one screen, **When** the visitor browses,
   **Then** they can filter by industry and by solution type.

---

### User Story 6 - Explore Digital Marketing Services (Priority: P3)

A marketing decision maker opens Digital Marketing from the main navigation, understands how U
Design improves digital presence and generates opportunities (Social Media Marketing and
Management, Content Creation, Meta Ads, Lead Generation, Performance Marketing, Digital Strategy),
sees how marketing connects to U Design's software capability, and requests a consultation.

**Why this priority**: Marketing is a core service, but the priority acquisition goal is
corporate and manufacturing software clients.

**Independent Test**: Publish the Digital Marketing page alone. A visitor can understand each
marketing service, its business outcome, and how to start.

**Acceptance Scenarios**:

1. **Given** the Digital Marketing page, **When** read, **Then** each of the seven marketing
   services is described in terms of business outcomes (reaching the right audience, brand
   visibility, lead generation, digital presence, growth).
2. **Given** any marketing content, **When** reviewed, **Then** it makes no guaranteed-result
   promises (e.g., "guaranteed leads" or "double your sales") and no unverified statistics.
3. **Given** the page, **When** read, **Then** it shows how marketing and software work together
   under "Build. Market. Grow." and ends with a consultation CTA (secondary CTA "Grow Your
   Business" allowed).

---

### User Story 7 - Evaluate U Design as a Company (Priority: P3)

A cautious buyer visits About and Contact to judge credibility: who U Design is, its approach,
software and marketing expertise, business-focused philosophy, and how to reach the company
directly (email, phone, social links, location when provided).

**Why this priority**: Supports trust and closes the journey but is not usually the entry point.

**Independent Test**: Publish About and Contact. A visitor can describe U Design's approach and
contact the company through at least two channels.

**Acceptance Scenarios**:

1. **Given** the About page, **When** read, **Then** it covers who U Design is, what it does, its
   approach, software expertise, digital marketing expertise, business-focused philosophy, and why
   businesses work with U Design, without exaggerated or unverified claims.
2. **Given** the Contact page, **When** loaded, **Then** it shows the consultation form and only
   the business contact details that U Design has provided (email, phone, social links,
   location). Any detail not provided is omitted, not invented.
3. **Given** a visitor selects the email or phone detail on a mobile device, **When** activated,
   **Then** it opens the device's email or phone app.

---

### User Story 8 - Find and Read Helpful Articles (Priority: P3)

An operations manager searches for "how to move inventory from Excel to software", lands on a U
Design blog article, finds genuinely useful guidance, discovers related articles and relevant
solution or industry pages, and eventually requests a consultation.

**Why this priority**: Long-term organic growth channel. It only delivers value once real articles
exist.

**Independent Test**: Publish the blog index and one article. A visitor can read the article
comfortably on mobile, navigate to related content, and reach the consultation form.

**Acceptance Scenarios**:

1. **Given** the blog index, **When** loaded, **Then** articles are listed newest first with title,
   summary, topic/category, and publish date, and can be filtered by topic.
2. **Given** an article, **When** read, **Then** it shows title, author (when provided), publish
   and updated dates, readable formatting, related articles, links to relevant solution or
   industry pages, and a consultation CTA.
3. **Given** no articles are published yet, **When** the site launches, **Then** the blog is not
   linked from navigation and no empty blog page is indexed by search engines.

---

### Edge Cases

- **Missing verified content**: No client logos, testimonials, results, contact details, or social
  links provided → the related section or element is hidden. Placeholders never appear on the
  live site (Constitution Principle II).
- **Concept vs. client project**: A concept project appears on an industry or home page → it keeps
  its Concept/Demo label everywhere it appears.
- **Industry without a project**: The industry page omits "related projects" or links to the full
  portfolio instead.
- **Industry not listed**: A visitor's industry is not among the eight → the Industries overview
  and the form's Industry field include an "Other" option, and messaging explains that solutions
  are adapted to any business workflow.
- **Form: submission failure / slow connection**: Data preserved, clear retry path, and an
  alternative contact method shown. Duplicate clicks do not create duplicate requests.
- **Form: spam and bots**: Automated spam is filtered without forcing a difficult challenge on
  genuine visitors.
- **Form: international phone numbers**: Phone accepts international formats with country codes.
- **Form: very long message**: A reasonable maximum length is enforced with a visible character
  limit.
- **Interactive features fail to load** (e.g., old browser, blocked scripts, poor connection): All
  content and navigation remain readable, and the consultation form still submits (or clearly
  offers email/phone alternatives).
- **Mobile navigation**: All primary navigation items and the primary CTA remain reachable on
  small screens (320px wide and up). Wide content such as dashboard screenshots and feature tables
  remains fully viewable without the page scrolling horizontally.
- **Reduced motion**: Visitors who prefer reduced motion see no non-essential animation.
- **Unknown or removed URL**: A branded "page not found" page offers navigation to Home, Solutions,
  Industries, and the consultation CTA. Renamed pages redirect to their new address.
- **Shared links**: A page shared on social or messaging apps shows a meaningful title,
  description, and image preview.
- **Screenshots unavailable**: A showcase project without real interface screenshots is not
  published until product UI visuals exist (no random or unrelated images).

## Requirements *(mandatory)*

### Functional Requirements

#### Global: Navigation, Layout, and CTAs

- **FR-001**: The site MUST provide primary navigation with Home, Solutions, Industries, Digital
  Marketing, Portfolio, About, and Contact, plus a persistent "Get Free Consultation" primary CTA,
  on every page.
- **FR-002**: Solutions and Industries navigation items MUST give direct access to their
  individual pages as well as their overview pages.
- **FR-003**: On small screens, navigation MUST collapse into an accessible menu that exposes all
  primary items and the primary CTA.
- **FR-004**: Every page MUST provide at least one path to the consultation form. Home, solution,
  industry, and marketing pages MUST show a consultation CTA without scrolling.
- **FR-005**: CTA wording MUST use only the approved set: primary "Get Free Consultation";
  secondary "View Our Solutions", "View Case Study", "Discuss Your Business", "Discuss Your
  Business Process", "Grow Your Business". No section may show more than one primary and one
  secondary CTA.
- **FR-006**: The site MUST include a footer with navigation to main sections, individual
  solutions and industries, contact details and social links (only those provided), and links to
  legal pages.
- **FR-007**: The site MUST provide a branded "page not found" page with helpful navigation and
  the consultation CTA.
- **FR-008**: Detail pages (solution, industry, project, article) MUST show breadcrumbs.

#### Home Page

- **FR-010**: The home page hero MUST display "Build. Market. Grow.", the headline "Digital
  Solutions That Help Businesses Grow", the supporting message "We build custom software,
  dashboards and automation systems while helping businesses grow through digital marketing and
  performance-driven advertising.", "Get Free Consultation" (primary), and "View Our Solutions"
  (secondary, leading to the Solutions hub).
- **FR-011**: The hero MUST include a visual representing business software, analytics/dashboards,
  and digital marketing in a premium product style.
- **FR-012**: The home page MUST include a "Trusted by Growing Businesses" section that displays
  only real, approved client logos and is hidden when none are available.
- **FR-013**: The home page MUST present the two service categories (Business Software & Digital
  Solutions; Digital Marketing & Growth) as distinct groups, with each service described by its
  business benefit, and MUST convey that both belong to one digital growth offering.
- **FR-014**: The home page MUST include an industry discovery section listing all launched
  industries with key workflows and links to each industry page.
- **FR-015**: The home page MUST include a software showcase featuring Manufacturing ERP, Travel
  Agency Management, and Real Estate CRM, each with its capabilities, purpose, type label, and a
  "View Case Study" link.
- **FR-016**: The home page MUST include the "Still Managing Your Business With Spreadsheets?"
  section. It MUST describe recognizable manual-process pain points (spreadsheets, disconnected
  systems, manual reporting, WhatsApp coordination, paper workflows, manual follow-ups), show the
  journey Manual Processes → Centralized Business Software → Real-Time Business Visibility, and
  include the "Discuss Your Business Process" CTA.
- **FR-017**: The home page MUST present the six-step process: 01 Discover, 02 Plan, 03 Design,
  04 Build, 05 Launch, 06 Grow, each with its description as supplied.
- **FR-018**: The home page MUST include a digital marketing section headed "Don't Just Build Your
  Business. Grow It." covering Social Media Marketing, Content Creation, Meta Ads, Lead Generation,
  Performance Tracking, and Digital Strategy in terms of business outcomes, with no guaranteed
  results.
- **FR-019**: The home page MUST include a "Why U Design" section with four themes:
  Business-Focused, Custom-Built, Scalable, and One Digital Partner.
- **FR-020**: The home page MUST end with a closing consultation section.

#### Solutions

- **FR-030**: The site MUST provide a Solutions hub listing each software solution with a one-line
  business benefit and a link to its page. Initial solutions: Custom Software, ERP, CRM, Business
  Dashboards, Workflow Automation.
- **FR-031**: Each solution page MUST include the business problem, how the solution helps,
  typical features, business benefits, suitable industries (linked), related projects (when
  available), the working process, and a consultation CTA.
- **FR-032**: Solution content MUST present software as custom-built around the client's
  workflow.

#### Industries

- **FR-040**: The site MUST provide an Industries overview listing all launched industries, each
  with its key workflows and a link to its page. Initial industries and workflows:
  Manufacturing (production, inventory, purchasing, sales, operations, reporting); Distribution
  (sales, inventory, warehouses, orders, customers, reporting); Real Estate (leads, properties,
  sales, bookings, customers, payments); Construction (projects, procurement, materials, expenses,
  progress); Logistics (fleet, shipments, drivers, fuel, maintenance, operations); Travel &
  Tourism (customers, packages, bookings, visa processing, payments); Healthcare (patients,
  appointments, consultations, billing, business operations); Retail (products, inventory, sales,
  customers, reporting).
- **FR-041**: Each industry page MUST include: common business challenges, relevant workflows,
  suitable software solutions (linked), important features, business benefits, relevant portfolio
  or demo projects (when available), and a consultation CTA.
- **FR-042**: Each industry page's challenges, workflows, and features MUST be specific to that
  industry.
- **FR-043**: The Manufacturing page MUST cover production management, inventory, raw materials,
  purchasing, sales, warehouse, reporting, and management dashboards, and MUST be given the most
  prominent position among industries.

#### Portfolio

- **FR-050**: The site MUST provide a Portfolio listing all published projects with name,
  industry, solution type, type label (Concept/Demo or Client Project), summary, and preview
  image. It MUST support filtering by industry and solution type.
- **FR-051**: Each project page MUST follow Problem → Solution → Features → Business Application
  and support: project name, industry, business challenge, solution, features, screenshots with
  captions, business application, technologies (optional), and results (only when verified).
- **FR-052**: Concept/demo projects MUST be labeled as such wherever they appear and MUST NOT show
  client names, client logos, or results.
- **FR-053**: Screenshots MUST be actual interface screens or high-quality product UI, each with
  context. Screenshots MUST be viewable at a legible size on mobile.
- **FR-054**: Project pages MUST link to related industries and solutions and offer a
  consultation CTA.

#### Digital Marketing

- **FR-060**: The site MUST provide a Digital Marketing page covering Social Media Marketing,
  Social Media Management, Content Creation, Meta Ads, Lead Generation, Performance Marketing,
  and Digital Strategy, each described by its business outcome.
- **FR-061**: The Digital Marketing page MUST explain how marketing connects with U Design's
  software capability ("Build. Market. Grow.") and MUST NOT promise guaranteed results.

#### About and Contact

- **FR-070**: The About page MUST cover who U Design is, what it does, its approach, software
  expertise, digital marketing expertise, business-focused philosophy, and why businesses work
  with U Design.
- **FR-071**: The Contact page MUST include the consultation form and the business email, phone,
  social links, and location, showing only details U Design has provided.
- **FR-072**: Email and phone details MUST be actionable (open the device's mail or phone app).

#### Consultation Form

- **FR-080**: The consultation form MUST collect: Name (required), Company (required), Email
  (required), Phone (required), Industry (required; selection including "Other"), What they need
  (required; selection of U Design's services including "Not sure yet"), Budget range (optional;
  selection including "Prefer not to say"), and Message (optional).
- **FR-081**: The form MUST validate input before sending (required fields, valid email format,
  valid phone format including international numbers, message length limit) and show field-level
  error messages.
- **FR-082**: The form MUST be reachable in one action from every page's primary CTA and MUST be
  embedded on the Contact page.
- **FR-083**: When opened from an industry, solution, marketing, or project page, the form MUST
  pre-select the related Industry and/or "What they need" value.
- **FR-084**: On success, the visitor MUST see a clear confirmation stating that the request was
  received and what happens next.
- **FR-085**: On failure, the visitor MUST see a helpful error, keep their entered data, be able
  to retry, and see an alternative contact method (when provided).
- **FR-086**: Each successful submission MUST be delivered to U Design with all fields, the page
  it was submitted from, and the submission time. No submission may be lost silently.
  Delivery destination is configurable: email, a webhook (CRM, spreadsheet, automation tool),
  or both for redundancy (resolved in research R-1). The recipient inbox and any webhook target
  are supplied by U Design as configuration.
- **FR-087**: The form MUST include spam protection that does not burden genuine visitors, and
  MUST prevent duplicate submissions from repeated clicks.
- **FR-088**: The form MUST state how submitted data will be used and link to the Privacy Policy.
  It MUST NOT collect information beyond the listed fields.

#### Blog

- **FR-090**: The site MUST support a blog with an index (newest first, filterable by topic) and
  article pages showing title, summary, author (when provided), publish and updated dates, topic,
  related articles, contextual links to relevant solution or industry pages, and a consultation
  CTA.
- **FR-091**: Blog topics MUST include business software, ERP, CRM, manufacturing technology,
  business dashboards, automation, digital transformation, digital marketing, Meta Ads, social
  media, and lead generation.
- **FR-092**: The blog MUST NOT be linked or indexed until at least one substantive article is
  published.

#### Search Visibility and Sharing

- **FR-100**: Every indexable page MUST have a unique title and description, a clean descriptive
  address, a single main heading, logical heading order, meaningful image descriptions, and
  meaningful internal links.
- **FR-101**: Every page MUST provide a meaningful preview (title, description, image) when shared
  on social or messaging platforms.
- **FR-102**: The site MUST give search engines a complete, current list of indexable pages and
  clear crawling rules, and MUST redirect changed addresses to their new location.
- **FR-103**: Structured information for search engines MUST describe only information visible on
  the page (e.g., organization details, services, breadcrumbs, articles). Reviews, ratings, and
  awards MUST NOT be included unless real and displayed.
- **FR-104**: Page content MUST naturally address commercial-intent topics (e.g., custom software
  development, custom ERP development, CRM development, business dashboard development,
  manufacturing ERP software, inventory management software, business process automation, digital
  marketing services, social media marketing, Meta Ads management, lead generation services)
  without keyword stuffing.

#### Content Integrity and Legal

- **FR-110**: The site MUST NOT display fabricated testimonials, client names, logos, results,
  statistics, awards, certifications, or partnerships. Unverified items MUST be hidden until
  verified.
- **FR-111**: The site MUST provide a Privacy Policy page describing what data is collected
  through the form (and analytics, if used) and why.
- **FR-112**: If analytics or tracking is used, it MUST record consultation submissions and CTA
  clicks, and MUST request visitor consent where legally required.

#### Experience Quality (acceptance constraints from the constitution)

- **FR-120**: All pages and features MUST be fully usable on mobile, tablet, laptop, and desktop,
  with deliberate mobile layouts for navigation, hero, dashboard visuals, cards, tables, forms,
  CTAs, and portfolio. No page may scroll horizontally.
- **FR-121**: All pages MUST meet WCAG 2.2 AA, including keyboard access, visible focus, labeled
  form fields, sufficient contrast within the brand palette, and reduced-motion support.
- **FR-122**: Pages MUST load quickly on typical mobile connections (see SC-006), and animation
  MUST be subtle and never delay access to content.
- **FR-123**: The visual design MUST use only the approved U Design palette and typography and a
  consistent component system, delivering a premium corporate SaaS aesthetic.
- **FR-124**: All copy MUST be written for business decision makers: professional, clear,
  concise, business-value first, with no empty buzzwords, overpromising, or unexplained jargon.

#### Scope of Launch

- **FR-130**: The site MUST support all 8 industry pages, 5 solution pages, and the digital
  marketing service pages. A detail page MUST go live only when its content is complete and
  approved. Navigation, footer, sitemap, and cross-links MUST include only live pages (resolved
  in research R-2; recommended writing priority: Manufacturing, ERP, Custom Software).

### Key Entities

- **Software Solution**: A software capability (e.g., ERP). Attributes: name, short benefit,
  business problem, how it helps, features, benefits, suitable industries, related projects,
  search title and description.
- **Marketing Service**: A marketing capability (e.g., Meta Ads). Attributes: name, business
  outcome, description.
- **Industry**: A target sector. Attributes: name, key workflows, challenges, relevant solutions,
  features, benefits, related projects, display priority, search title and description.
- **Project (Portfolio Item)**: A showcase or case study. Attributes: name, industry, solution
  type(s), type (Concept/Demo or Client Project), business challenge, solution, features,
  screenshots with captions, business application, technologies (optional), verified results
  (optional, client projects only), client name or logo (optional, client projects only, with
  permission), featured flag.
- **Blog Article**: Attributes: title, summary, body, topic(s), author (optional), publish and
  updated dates, related solutions and industries, search title and description.
- **Consultation Request**: A lead. Attributes: name, company, email, phone, industry, service
  need, budget range, message, source page, submission time.
- **Client Logo**: An approved client mark. Attributes: company name, logo image, permission
  confirmed.
- **Company Profile**: Business contact information. Attributes: email, phone, location/address,
  social links, business hours (optional), response-time statement.
- **Process Step**: Number, title, description (six steps).
- **Selection Lists**: Industry options, service-need options, budget range options.

### Configurable Content (MUST NOT be hard-coded)

Content MUST be maintainable as data so that it can be added or changed without restructuring
pages:

- Software solutions and marketing services (names, descriptions, features, ordering)
- Industries (content, workflows, ordering, featured status)
- Portfolio projects and case studies (including type label and featured flag)
- Blog articles and topics
- Client logos (with permission flag) and any future testimonials (verified only)
- Company profile: email, phone, location, social links, response-time statement
- Consultation form selection lists: industries, service needs, budget ranges
- Hero text, section headlines, and CTA labels and destinations
- Six-step process text and Why U Design themes
- Search titles, descriptions, and social preview images per page
- Legal page content (Privacy Policy)

### Feature Dependencies

- **Consultation form (US2)** depends on the Company Profile (for fallback contact details), the
  selection lists (industries, service needs, budget ranges), the Privacy Policy, and the
  delivery destination (FR-086).
- **Home page (US1)** depends on the service, industry, and project content for its sections, the
  consultation form for CTAs, and client logos for the trust section (optional).
- **Industry pages (US3)** depend on the solution pages (links) and projects (related work).
- **Solution pages (US4)** depend on industry pages (links) and projects.
- **Portfolio (US5)** depends on approved project material: descriptions and real interface
  screenshots or product UI for the three showcase projects.
- **Blog (US8)** depends on written articles and links into solution and industry pages.
- **Global navigation and footer** depend on the final list of launched pages (FR-130).
- **Search visibility (FR-100–FR-104)** applies to every page and depends on per-page search
  titles and descriptions being authored.

### Missing Information (content inputs required from U Design before launch)

These are business facts that MUST NOT be invented. Each is marked for U Design to supply.
Sections depending on missing items are hidden until supplied.

| Item | Needed for | If not supplied |
|---|---|---|
| Approved client logos and usage permission | Trust section | Section hidden |
| Business email, phone, location/address | Contact page, footer, form fallback | Omitted (at least one contact channel is required for launch) |
| Social media profile links | Contact page, footer | Omitted |
| Consultation response timeframe (e.g., "within 1 business day") | Form confirmation | Generic "we'll be in touch soon" message |
| Budget range options and currency | Consultation form | Budget field omitted |
| Company background for About page (founding story, team, location, experience) | About page | About page limited to approach and services |
| Final project descriptions and interface screenshots for the three showcase projects | Portfolio, home showcase | Project not published |
| Whether any real client projects, testimonials, or verified results exist | Portfolio, trust | Not shown |
| Privacy Policy text (or approval of a drafted version) | Legal, form | Launch blocked (required for form) |
| Brand logo files and approved hero visual direction | All pages | Blocks visual design |
| Initial blog articles | Blog | Blog hidden (FR-092) |
| Showcase projects: concept/demo or real client work | Portfolio labeling | Treated as Concept/Demo (research R-3) |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a 5-second test, at least 80% of first-time participants from the target audience
  correctly state that U Design provides custom business software and digital marketing.
- **SC-002**: At least 90% of test participants can answer all five questions ("What does U
  Design do? Who does it help? Can it build something for my business? Can I see examples? How do
  I start?") after at most 2 minutes on the site.
- **SC-003**: From any page, a visitor reaches the consultation form in 1 action, and a
  manufacturing visitor reaches the Manufacturing page in at most 2 actions from the home page.
- **SC-004**: A visitor can complete and submit the consultation form in under 2 minutes on mobile
  and desktop.
- **SC-005**: 100% of successful form submissions are received by U Design with all fields intact
  (verified by end-to-end test submissions before launch and periodically after).
- **SC-006**: On a typical mobile connection, the main content of every page appears within
  2.5 seconds, and pages respond to interaction without noticeable delay (constitution Principle
  III thresholds).
- **SC-007**: 100% of pages meet WCAG 2.2 AA in automated checks (zero critical or serious issues)
  and pass manual keyboard-only navigation of the full consultation journey.
- **SC-008**: 100% of pages display without horizontal scrolling and with all content accessible
  at widths from 320px to 1920px.
- **SC-009**: 100% of indexable pages have a unique title and description and a meaningful share
  preview. All indexable pages are discoverable by search engines within 4 weeks of launch.
- **SC-010**: A pre-launch content audit finds zero fabricated or unverified claims, zero
  placeholders on the live site, and every concept project correctly labeled.
- **SC-011**: At least 70% of test participants rate the site as "professional" or "very
  professional" and "trustworthy" on a post-task survey.
- **SC-012**: Within 3 months of launch, the site generates a measurable flow of consultation
  requests, tracked monthly, with the share of requests from corporate/manufacturing businesses
  reported. (Baseline to be established in the first month; there is no prior site to compare.)
- **SC-013**: Adding a new industry, solution, project, or article requires only content entry
  and no page redesign, and a new entry can be published within one working day of content being
  ready.

## Assumptions

- The website is in English only at launch.
- There is no login, client portal, e-commerce, pricing page, or live chat at launch.
- Software showcase items are presented as static screenshots and product UI visuals with
  explanations, not interactive live demos.
- "Business Process Digitalization" is covered through the home page digitalization section and
  within Custom Software and Workflow Automation content rather than as a separate solution page,
  since the Solutions hub lists five categories.
- Digital marketing services are presented on a Digital Marketing hub page plus dedicated pages
  for Social Media, Meta Ads, Content, and Lead Generation (per the planning brief). Digital
  Strategy appears on the hub until its own page is written.
- "Performance Tracking" (home marketing section) refers to the Performance Marketing service.
- Consultation requests are handled by U Design staff manually after delivery. No automated
  scheduling or booking is required.
- Content is maintained by U Design (or its developers) through the site's content data. A
  visual content-management interface for non-technical editors is not required at launch.
- Analytics is desired for measuring conversion (SC-012) and will be privacy-respecting.
- Visitors may come from any country, so phone numbers accept international formats.
- Testimonials are not required at launch and will be added only when real and approved.

## Out of Scope

- Client login areas, dashboards, or software product functionality (the site describes software;
  it does not host it).
- Online payments, pricing calculators, or quotes.
- Multi-language support.
- Live chat or chatbot.
- Job listings/careers page (unless requested later).

## Clarifications

### Session 2026-09-19 (resolved during planning; see research.md §R)

- Q: Where are consultation requests delivered? → A: Configurable delivery by email, webhook
  (CRM or spreadsheet), or both. Recommended: both, for redundancy. U Design supplies the
  destinations.
- Q: Which detail pages are live at launch? → A: All pages are supported. Each goes live when its
  content is complete and approved, and navigation and sitemap include only live pages.
- Q: Are the three showcase projects concepts or client work? → A: They are treated as
  Concept/Demo until U Design confirms otherwise. Client names and results appear only for
  confirmed client projects with permission.
