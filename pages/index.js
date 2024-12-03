import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Head>
        <title>Auto Lens</title>
        <meta name="description" content="Auto Lens - Your AI Camera Assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {!showLogin ? (
          <div 
            className={styles.logoContainer}
            onClick={() => setShowLogin(true)}
          >
            <div className={styles.logo}>
              <span>Auto Lens</span>
            </div>
          </div>
        ) : (
          <div className={styles.loginContainer}>
            <button 
              className={styles.backButton}
              onClick={() => setShowLogin(false)}
            >
              ←
            </button>
            <div className={styles.imageContainer}>
              <Image 
                src="/Autolens.png" 
                alt="placeholder" 
                width={80} 
                height={80}
              />
            </div>
            <h1 className={styles.title}>
              Auto Lens Application
            </h1>
            <p className={styles.description}>
              The future of photography is here. Made by JP.
            </p>
            <div className={styles.buttonContainer}>
              <Link href="/signup" className={styles.signupButton}>
                Sign up
              </Link>
              <Link href="/login" className={styles.loginButton}>
                Log in
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
