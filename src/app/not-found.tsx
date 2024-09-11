import Link from "next/link";

// This is a server-side component
export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Oops! The page you are looking for doesnot exist.
      </p>
      <Link href="/" style={styles.button}>
        Go Back to Home
      </Link>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px",
    textAlign: "center" as const,
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "36px",
    color: "#ff4c4c",
  },
  message: {
    fontSize: "18px",
    margin: "20px 0",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    textDecoration: "none",
    backgroundColor: "#0070f3",
    color: "#fff",
    borderRadius: "5px",
  },
};
