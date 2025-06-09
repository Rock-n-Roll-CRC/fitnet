import LoginForm from "@/components/LoginForm/LoginForm";
import SignUpForm from "@/components/SignUpForm/SignUpForm";

import styles from "./styles.module.scss";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const type = (await searchParams).type ?? "sign-in";

  return (
    <main className={styles.main}>
      {type === "sign-in" ? <LoginForm /> : <SignUpForm />}
    </main>
  );
};

export default Page;
