import FeatureBlock from "@/components/FeatureBlock/FeatureBlock";
import QuoteBlock from "@/components/QuoteBlock/QuoteBlock";
import Feature from "@/components/Feature/Feature";

import danilDikhtyar from "@/assets/images/danil-dikhtyar.webp";
import dataAnalytics from "@/assets/illustrations/data-analytics.gif";
import targetAudience from "@/assets/illustrations/target-audience.gif";

import SearchSVG from "@/assets/icons/search-outline.svg";
import CalendarSVG from "@/assets/icons/calendar-outline.svg";
import BarChartSVG from "@/assets/icons/bar-chart-outline.svg";

import SeparatorSVG from "@/assets/shapes/shape-1.svg";

import styles from "./Features.module.scss";

const Features = () => {
  return (
    <section id="features" className={styles.features}>
      <FeatureBlock>
        <FeatureBlock.Picture image={dataAnalytics} alt="test" />

        <FeatureBlock.Body>
          <FeatureBlock.TextContent>
            <FeatureBlock.Heading>
              Efficient management sets your business up for growth
            </FeatureBlock.Heading>
            <FeatureBlock.Description>
              The unique approach to client management our team at FitNet came
              up with enables coaches to save time on doing routine tasks and
              grow their client network all inside one app!
            </FeatureBlock.Description>
          </FeatureBlock.TextContent>

          <QuoteBlock
            authorImage={danilDikhtyar}
            authorName="Danil Dikhtyar"
            authorPosition="Founder"
          >
            The whole idea behind the application was to make the coach&apos;s
            life easier
          </QuoteBlock>
        </FeatureBlock.Body>

        <SeparatorSVG className={styles.features__separator} />
      </FeatureBlock>

      <FeatureBlock>
        <FeatureBlock.Body>
          <FeatureBlock.TextContent>
            <FeatureBlock.Heading>
              Simplify your coaching workflow
            </FeatureBlock.Heading>
            <FeatureBlock.Description>
              We know what coaches need: less hassle, more clients. That is
              exactly what FitNet was designed for - the all-in-one tool where
              you can do all you might need, from scaling your business to
              managing statistics. That&apos;s how we empower coaches and drive
              value.
            </FeatureBlock.Description>
          </FeatureBlock.TextContent>

          <FeatureBlock.FeatureList>
            <Feature>
              <Feature.Icon icon={SearchSVG} />
              <Feature.TextContent>
                <Feature.Heading>Find your clients</Feature.Heading>
                <Feature.Description>
                  Users signed up as clients will search for nearby coaches.
                  That&apos;s where you get in the scene.
                </Feature.Description>
              </Feature.TextContent>
            </Feature>

            <Feature>
              <Feature.Icon icon={CalendarSVG} />
              <Feature.TextContent>
                <Feature.Heading>Track reserved sessions</Feature.Heading>
                <Feature.Description>
                  Use our interactive calendar to track who, when and for how
                  long is gonna use your services.
                </Feature.Description>
              </Feature.TextContent>
            </Feature>

            <Feature>
              <Feature.Icon icon={BarChartSVG} />
              <Feature.TextContent>
                <Feature.Heading>Know your statistics</Feature.Heading>
                <Feature.Description>
                  Take a look at various charts and diagrams reflecting your
                  revenue, utilization rate, member retention rates and more!
                </Feature.Description>
              </Feature.TextContent>
            </Feature>
          </FeatureBlock.FeatureList>
        </FeatureBlock.Body>

        <FeatureBlock.Picture image={targetAudience} alt="test" />
      </FeatureBlock>
    </section>
  );
};

export default Features;
