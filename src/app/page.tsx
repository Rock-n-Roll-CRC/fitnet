import Header from "@/components/Header/Header";
import Logo from "@/components/Logo/Logo";
import HamburgerMenu from "@/components/HamburgerMenu/HamburgerMenu";
import ColorThemeSwitcher from "@/components/ColorThemeSwitcher/ColorThemeSwitcher";

const Page = () => {
  return (
    <Header>
      <Logo />

      <Header.Container>
        <HamburgerMenu />
        <ColorThemeSwitcher />
      </Header.Container>
    </Header>
  );
};

export default Page;
