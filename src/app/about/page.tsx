import Link from "@/components/ui/AppLink";
import { CapabilityRow } from "@/components/cards/CapabilityRow";
import { ProcessSteps } from "@/components/cards/ProcessStep";
import { Section } from "@/components/layout/Section";
import { ScrollStagger } from "@/components/motion/ScrollStagger";
import { ProseBlock } from "@/components/sections/shared/ContentBlocks";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { PageHero } from "@/components/sections/shared/PageHero";
import { sectionImages } from "@/lib/content/images";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/content/about";
import { processSteps } from "@/content/process";
import { whyThemes } from "@/content/why";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { pageSeo } from "@/content/pages-seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ ...pageSeo.about, path: "/about" });

/** About page (spec FR-070). No invented history or statistics. */
export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumbs={buildTrail([{ name: "About", path: "/about" }])}
        eyebrow="About U Design"
        title={about.hero.heading}
        intro={about.hero.intro}
        secondaryCta={{ label: "View Our Solutions", href: "/solutions" }}
        image={sectionImages.corporateTeam}
      />

      <ProseBlock id="who" eyebrow="Who we are" heading={about.who.heading} body={about.who.body} />

      {about.foundingStory?.length ? (
        <ProseBlock
          id="story"
          surface="gray"
          eyebrow="Our story"
          heading="How U Design started"
          body={about.foundingStory}
        />
      ) : null}

      <Section surface="gray" id="approach" labelledBy="approach-heading">
        <SectionHeading
          id="approach-heading"
          level={2}
          eyebrow="Approach"
          title={about.approach.heading}
          intro={about.approach.intro}
        />
        <ScrollStagger as="ol" className="mt-10 max-w-3xl">
          {about.approach.points.map((p, i) => (
            <CapabilityRow key={p.title} index={i + 1} name={p.title} benefit={p.description} />
          ))}
        </ScrollStagger>
      </Section>

      <Section surface="white" id="expertise" labelledBy="expertise-heading">
        <SectionHeading
          id="expertise-heading"
          level={2}
          eyebrow="Expertise"
          title="Two capabilities, one partner"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {about.expertise.map((e) => (
            <Card key={e.heading} variant="feature" className="h-full">
              <span className="inline-flex size-12 items-center justify-center rounded-control bg-brand-green text-ink">
                <Icon name={e.icon} size={24} />
              </span>
              <h3 className="mt-5 text-h3">{e.heading}</h3>
              <p className="mt-2 text-ink-muted">{e.description}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {e.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon
                      name="check"
                      size={18}
                      className="mt-0.5 shrink-0 text-brand-green-dark"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={e.href} className="mt-6 inline-block font-semibold link-inline">
                Explore {e.heading.replace(" expertise", "").toLowerCase()}
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <ProseBlock
        id="philosophy"
        surface="ink"
        eyebrow="Our philosophy"
        heading={about.philosophy.heading}
        body={about.philosophy.body}
      />

      <Section surface="white" id="why" labelledBy="why-heading">
        <SectionHeading
          id="why-heading"
          level={2}
          eyebrow="Why businesses work with us"
          title="Why U Design"
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyThemes.map((t) => (
            <li key={t.title} className="border-l-2 border-brand-green-dark pl-5">
              <h3 className="text-h4">{t.title}</h3>
              <p className="mt-1.5 text-ink-muted">{t.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section surface="gray" id="process" labelledBy="process-heading">
        <SectionHeading id="process-heading" level={2} eyebrow="How we work" title="How We Work" />
        <div className="mt-10">
          <ProcessSteps steps={processSteps} compact />
        </div>
      </Section>

      <CtaBanner
        title="Let's talk about your business"
        text="Tell us where you are today and where you want to be. We will suggest a practical first step."
        context={{ source: "/about" }}
      />
      <JsonLd data={breadcrumbList(buildTrail([{ name: "About", path: "/about" }]))} />
    </>
  );
}
