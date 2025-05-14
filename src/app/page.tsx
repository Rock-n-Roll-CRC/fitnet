import Header from "@/components/Header/Header";
import Logo from "@/components/Logo/Logo";
import HamburgerMenu from "@/components/HamburgerMenu/HamburgerMenu";
import ColorThemeSwitcher from "@/components/ColorThemeSwitcher/ColorThemeSwitcher";
import Main from "@/components/Main/Main";
import Hero from "@/components/Hero/Hero";
import Features from "@/components/Features/Features";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";

const Page = () => {
  return (
    <>
      <Header>
        <Logo />

        <Header.Container>
          <HamburgerMenu />
          <ColorThemeSwitcher />
        </Header.Container>
      </Header>

      <Main>
        <Hero />

        <Features />

        <HowItWorks />

        <Testimonials />
      </Main>

      <Footer />
    </>
  );
};

export default Page;
