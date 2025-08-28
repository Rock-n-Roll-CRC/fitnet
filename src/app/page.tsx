import Header from "@/components/Header/Header";
import Logo from "@/components/Logo/Logo";
import NavigationList from "@/components/NavigationList/NavigationList";
import HamburgerMenu from "@/components/HamburgerMenu/HamburgerMenu";
import ColorThemeSwitcher from "@/components/ColorThemeSwitcher/ColorThemeSwitcher";
import Main from "@/components/Main/Main";
import Hero from "@/components/Hero/Hero";
import Features from "@/components/Features/Features";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";
import Button from "@/components/Button/Button";
import { auth } from "@/services/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (session) {
    return redirect("search");
  }

  return (
    <>
      <Header>
        <Logo />

        <NavigationList location="header" />

        <Header.Container>
          <Button type="call-to-action" location="header">
            Sign Up
          </Button>
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

// Add setup page (on register)
