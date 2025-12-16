import FeatureBlock from "@/components/FeatureBlock/FeatureBlock";
import QuoteBlock from "@/components/QuoteBlock/QuoteBlock";
import Feature from "@/components/Feature/Feature";

import danilDikhtyar from "@/assets/images/danil-dikhtyar.webp";
import dataAnalytics from "@/assets/illustrations/data-analytics.gif";
import targetAudience from "@/assets/illustrations/target-audience.gif";

import SearchSVG from "@/assets/icons/search-outline.svg";
import ChatboxEllipsesOutlineSVG from "@/assets/icons/chatbox-ellipses-outline.svg";
import StarOutlineSVG from "@/assets/icons/star-outline.svg";

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
              Building your fitness network sets you up for success
            </FeatureBlock.Heading>
            <FeatureBlock.Description>
              The unique approach to fitness networking our team at FitNet came
              up with helps you avoid awkward mismatches and build genuine
              connections with trainers who are excited to help you succeed!
            </FeatureBlock.Description>
          </FeatureBlock.TextContent>

          <QuoteBlock
            authorImage={danilDikhtyar}
            authorName="Danil Dikhtyar"
            authorPosition="Founder"
          >
            The whole idea behind the application was to make finding your
            perfect coach easier
          </QuoteBlock>
        </FeatureBlock.Body>

        <SeparatorSVG className={styles.features__separator} />
      </FeatureBlock>

      <FeatureBlock>
        <FeatureBlock.Body>
          <FeatureBlock.TextContent>
            <FeatureBlock.Heading>
              Your fitness journey starts here
            </FeatureBlock.Heading>
            <FeatureBlock.Description>
              We know what clients need: the right coach, in the right location,
              with the right expertise. That is exactly what FitNet was designed
              for - the all-in-one platform where you can discover, connect, and
              communicate with fitness professionals who match your goals.
              That&apos;s how we empower your fitness transformation.
            </FeatureBlock.Description>
          </FeatureBlock.TextContent>

          <FeatureBlock.FeatureList>
            <Feature>
              <Feature.Icon icon={SearchSVG} />
              <Feature.TextContent>
                <Feature.Heading>Discover coaches near you</Feature.Heading>
                <Feature.Description>
                  Use our interactive map to find qualified fitness coaches in
                  your area. Filter by distance, expertise, and gender to match
                  with trainers who fit your needs.
                </Feature.Description>
              </Feature.TextContent>
            </Feature>

            <Feature>
              <Feature.Icon icon={ChatboxEllipsesOutlineSVG} />
              <Feature.TextContent>
                <Feature.Heading>Connect instantly</Feature.Heading>
                <Feature.Description>
                  Message coaches directly through our built-in chat system. Ask
                  questions, discuss goals, and schedule sessions without
                  switching between apps.
                </Feature.Description>
              </Feature.TextContent>
            </Feature>

            <Feature>
              <Feature.Icon icon={StarOutlineSVG} />
              <Feature.TextContent>
                <Feature.Heading>Trust real feedback</Feature.Heading>
                <Feature.Description>
                  Check out ratings and reviews from people just like you. Know
                  exactly what you&apos;re getting into before your first
                  session.
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
