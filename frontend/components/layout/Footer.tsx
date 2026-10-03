import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white text-gray-900 transition-colors duration-200 dark:border-white/10 dark:bg-black dark:text-white">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 md:grid-cols-4">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white text-lg dark:bg-white dark:text-black">
                                🚀
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Connext
                            </span>
                        </div>

                        <p className="mt-4 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">
                            A nationwide academic collaboration platform where students,
                            faculty, researchers, and mentors connect, learn, and contribute.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Platform
                        </h3>

                        <div className="mt-4 space-y-3">
                            <Link
                                href="#"
                                className="block text-sm text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                            >
                                Ask Questions
                            </Link>

                            <Link
                                href="#"
                                className="block text-sm text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                            >
                                Collaborate
                            </Link>

                            <Link
                                href="/community"
                                className="block text-sm text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                            >
                                Community
                            </Link>
                        </div>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Community
                        </h3>

                        <div className="mt-4 space-y-3">
                            <Link
                                href="#"
                                className="block text-sm text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                            >
                                Students
                            </Link>

                            <Link
                                href="#"
                                className="block text-sm text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                            >
                                Faculty
                            </Link>

                            <Link
                                href="#"
                                className="block text-sm text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                            >
                                Researchers
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400 md:flex-row md:items-center md:justify-between">
                    <p>© 2026 Connext. All rights reserved.</p>

                    <p>Ask without fear. Get known for what you give.</p>
                </div>
            </div>
        </footer>
    );
}