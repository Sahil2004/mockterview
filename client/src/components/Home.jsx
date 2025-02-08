import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="grid max-w-screen-xl px-4 text-center lg:text-left lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl xl:text-6xl dark:text-white">
            MOCKTERVIEW  <span className="text-2xl ">your personal interviewer.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Get realistic, high-quality mock interview practice with AI-driven insights. Overcome the challenges of limited access to experienced interviewers, generic feedback, and lack of personalized analysis to boost your confidence and performance.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
            <Link
              to="/login"
              className="px-6 py-3 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 mt-3 sm:mt-0 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              SIGN UP
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 hidden lg:flex justify-center">
          <img
            src="https://demo.themesberg.com/landwind/images/hero.png"
            alt="hero image"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;