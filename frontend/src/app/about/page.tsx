import Navbar from '@/components/Navbar';
import { Target, Lightbulb, Code, Users, CheckCircle } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        About BowlersNetwork Feature Tracker
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Transparency in development. Every feature tells a story of why we build what we build.
                    </p>
                </div>

                {/* Mission */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-12">
                    <div className="flex items-center mb-6">
                        <Target className="w-8 h-8 text-blue-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        We&apos;re building the ultimate bowling ecosystem that connects players, centers, and manufacturers.
                        But we believe in transparency. This feature tracker allows our clients and community to see
                        exactly what we&apos;re building, why we&apos;re building it, and how our decisions create value for everyone
                        in the bowling world.
                    </p>
                </div>

                {/* What Makes Us Different */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-12">
                    <div className="flex items-center mb-6">
                        <Lightbulb className="w-8 h-8 text-yellow-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-900">What Makes Us Different</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparent Development</h3>
                            <p className="text-gray-700">
                                Every feature comes with clear documentation of the purpose, implementation approach,
                                and technical decisions behind it.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Client-Focused</h3>
                            <p className="text-gray-700">
                                We build features that solve real problems for bowlers, centers, and manufacturers,
                                not just because we can.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Scalable Architecture</h3>
                            <p className="text-gray-700">
                                Our technical decisions are made with long-term scalability and maintainability in mind,
                                ensuring the platform grows with the community.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Driven</h3>
                            <p className="text-gray-700">
                                Features are prioritized based on real community needs and feedback from actual users
                                in the bowling ecosystem.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Development Process */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-12">
                    <div className="flex items-center mb-6">
                        <Code className="w-8 h-8 text-green-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-900">Our Development Process</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Identify the Need</h4>
                                <p className="text-gray-700">
                                    We start by understanding real problems faced by bowlers, centers, or manufacturers.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Research & Design</h4>
                                <p className="text-gray-700">
                                    We research the best approaches, considering scalability, user experience, and technical feasibility.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Document Everything</h4>
                                <p className="text-gray-700">
                                    Before coding, we document the purpose, approach, and technical decisions for transparency.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Build & Test</h4>
                                <p className="text-gray-700">
                                    We implement the feature with clean, maintainable code and thorough testing.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Deploy & Monitor</h4>
                                <p className="text-gray-700">
                                    Features are deployed with monitoring and feedback collection to ensure they meet user needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="flex items-center mb-6">
                        <Users className="w-8 h-8 text-purple-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-900">The Team</h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Our development team consists of experienced developers who understand both technology and the bowling industry.
                        We combine technical expertise with domain knowledge to build features that truly serve the bowling community.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 mb-3">Why We&apos;re Building This</h3>
                        <p className="text-blue-800">
                            The bowling industry has been underserved by technology. We&apos;re passionate about changing that by building
                            modern, scalable solutions that bring the bowling community together. Every line of code we write is
                            motivated by our desire to enhance the bowling experience for everyone involved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
