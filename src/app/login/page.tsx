import Image from "next/image";

import LoginForm from "@/components/LoginForm/LoginForm";
import SignUpForm from "@/components/SignUpForm/SignUpForm";

import shapesBackground from "@/assets/images/shapes-background.jpg";
import appSnapshot from "@/assets/images/app-image.png";

import styles from "./styles.module.scss";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const type = (await searchParams).type ?? "sign-in";

  return (
    <main className={styles.main}>
      <div className={styles.main__body}>
        <div className={styles["main__image-wrapper"]}>
          <Image
            src={shapesBackground}
            alt="Background of various shapes"
            className={styles.main__image}
          />

          <div className={styles["main__image-overlay"]}>
            <div className={styles["main__image-caption"]}>
              <div className={styles["main__text-content"]}>
                <h2 className={styles.main__heading}>
                  Enlarge your client base in a matter of few clicks.
                </h2>

                <p className={styles.main__description}>
                  Log in to access the map of clients searching for coaches like
                  yourself!
                </p>
              </div>

              <Image
                src={appSnapshot}
                alt="Map with some clients"
                className={styles["main__app-image"]}
              />
            </div>
          </div>
        </div>

        <div className={styles.main__form}>
          {type === "sign-in" ? <LoginForm /> : <SignUpForm />}
        </div>
      </div>
    </main>
  );
};

export default Page;
