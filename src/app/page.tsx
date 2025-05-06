import Header from "@/components/Header/Header";
import Logo from "@/components/Logo/Logo";
import HamburgerMenu from "@/components/HamburgerMenu/HamburgerMenu";
import ColorThemeSwitcher from "@/components/ColorThemeSwitcher/ColorThemeSwitcher";
import Main from "@/components/Main/Main";
import Hero from "@/components/Hero/Hero";
import Features from "@/components/Features/Features";

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
      </Main>
    </>
  );
};

export default Page;
