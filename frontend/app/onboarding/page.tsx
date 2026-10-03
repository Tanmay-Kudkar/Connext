"use client";

import {
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    GraduationCap,
    MapPin,
    Search,
    User,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "student" | "faculty" | "researcher" | "mentor";

export default function OnboardingPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [role, setRole] = useState<Role | "">("");
    const [institution, setInstitution] = useState("");
    const [course, setCourse] = useState("");
    const [year, setYear] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [researchArea, setResearchArea] = useState("");
    const [organization, setOrganization] = useState("");
    const [expertise, setExpertise] = useState("");
    const [experience, setExperience] = useState("");
    const [location, setLocation] = useState("");

    const handleContinue = () => {
        const academicProfile = {
            name,
            role,
            institution,
            course,
            year,
            department,
            designation,
            researchArea,
            organization,
            expertise,
            experience,
            location,
        };

        localStorage.setItem(
            "connextAcademicProfile",
            JSON.stringify(academicProfile)
        );

        router.push("/verify");
    };

    const getRoleTitle = () => {
        switch (role) {
            case "faculty":
                return "Faculty Identity";
            case "researcher":
                return "Researcher Identity";
            case "mentor":
                return "Mentor Identity";
            default:
                return "Academic Identity";
        }
    };

    return (
        <main className="min-h-[calc(100vh-64px)] bg-black px-6 py-12 text-white">
            <div className="mx-auto max-w-2xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-black">
                        🎓
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight">
                        Build your academic identity
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                        Tell us a little about yourself so we can personalize your
                        Connext experience.
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-white">Step 1 of 3</span>

                        <span className="text-gray-500">
                            {getRoleTitle()}
                        </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-1/3 rounded-full bg-white" />
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleContinue();
                        }}
                        className="space-y-6"
                    >

                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Full name
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label
                                htmlFor="role"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                I am a
                            </label>

                            <select
                                id="role"
                                value={role}
                                onChange={(event) =>
                                    setRole(event.target.value as Role)
                                }
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-white/30 focus:bg-white/[0.07]"
                            >
                                <option value="" disabled className="bg-black">
                                    Select your role
                                </option>

                                <option value="student" className="bg-black">
                                    Student
                                </option>

                                <option value="faculty" className="bg-black">
                                    Faculty
                                </option>

                                <option value="researcher" className="bg-black">
                                    Researcher
                                </option>

                                <option value="mentor" className="bg-black">
                                    Mentor
                                </option>
                            </select>
                        </div>

                        {/* STUDENT */}
                        {role === "student" && (
                            <>
                                {/* Institution */}
                                <div>
                                    <label
                                        htmlFor="institution"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Institution
                                    </label>

                                    <div className="relative">
                                        <GraduationCap
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        />

                                        <input
                                            id="institution"
                                            type="text"
                                            value={institution}
                                            onChange={(event) =>
                                                setInstitution(event.target.value)
                                            }
                                            placeholder="Enter your college or university"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">

                                    {/* Course */}
                                    <div>
                                        <label
                                            htmlFor="course"
                                            className="mb-2 block text-sm font-medium text-gray-300"
                                        >
                                            Course / Program
                                        </label>

                                        <input
                                            id="course"
                                            type="text"
                                            value={course}
                                            onChange={(event) =>
                                                setCourse(event.target.value)
                                            }
                                            placeholder="e.g. Computer Engineering"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                        />
                                    </div>

                                    {/* Academic Year */}
                                    <div>
                                        <label
                                            htmlFor="year"
                                            className="mb-2 block text-sm font-medium text-gray-300"
                                        >
                                            Academic Year
                                        </label>

                                        <select
                                            id="year"
                                            value={year}
                                            onChange={(event) =>
                                                setYear(event.target.value)
                                            }
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-white/30 focus:bg-white/[0.07]"
                                        >
                                            <option value="" disabled className="bg-black">
                                                Select year
                                            </option>

                                            <option value="1" className="bg-black">
                                                1st Year
                                            </option>

                                            <option value="2" className="bg-black">
                                                2nd Year
                                            </option>

                                            <option value="3" className="bg-black">
                                                3rd Year
                                            </option>

                                            <option value="4" className="bg-black">
                                                4th Year
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* FACULTY */}
                        {role === "faculty" && (
                            <>
                                {/* Institution */}
                                <div>
                                    <label
                                        htmlFor="institution"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Institution
                                    </label>

                                    <div className="relative">
                                        <Building2
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        />

                                        <input
                                            id="institution"
                                            type="text"
                                            value={institution}
                                            onChange={(event) =>
                                                setInstitution(event.target.value)
                                            }
                                            placeholder="College or university"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">

                                    {/* Department */}
                                    <div>
                                        <label
                                            htmlFor="department"
                                            className="mb-2 block text-sm font-medium text-gray-300"
                                        >
                                            Department
                                        </label>

                                        <input
                                            id="department"
                                            type="text"
                                            value={department}
                                            onChange={(event) =>
                                                setDepartment(event.target.value)
                                            }
                                            placeholder="e.g. Computer Engineering"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                        />
                                    </div>

                                    {/* Designation */}
                                    <div>
                                        <label
                                            htmlFor="designation"
                                            className="mb-2 block text-sm font-medium text-gray-300"
                                        >
                                            Designation
                                        </label>

                                        <select
                                            id="designation"
                                            value={designation}
                                            onChange={(event) =>
                                                setDesignation(event.target.value)
                                            }
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-white/30 focus:bg-white/[0.07]"
                                        >
                                            <option value="" disabled className="bg-black">
                                                Select designation
                                            </option>

                                            <option
                                                value="assistant-professor"
                                                className="bg-black"
                                            >
                                                Assistant Professor
                                            </option>

                                            <option
                                                value="associate-professor"
                                                className="bg-black"
                                            >
                                                Associate Professor
                                            </option>

                                            <option
                                                value="professor"
                                                className="bg-black"
                                            >
                                                Professor
                                            </option>

                                            <option
                                                value="hod"
                                                className="bg-black"
                                            >
                                                HOD
                                            </option>

                                            <option
                                                value="dean"
                                                className="bg-black"
                                            >
                                                Dean
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* RESEARCHER */}
                        {role === "researcher" && (
                            <>
                                {/* Institution / Organization */}
                                <div>
                                    <label
                                        htmlFor="institution"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Institution / Organization
                                    </label>

                                    <div className="relative">
                                        <Building2
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        />

                                        <input
                                            id="institution"
                                            type="text"
                                            value={institution}
                                            onChange={(event) =>
                                                setInstitution(event.target.value)
                                            }
                                            placeholder="University, lab, or organization"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                        />
                                    </div>
                                </div>

                                {/* Research Area */}
                                <div>
                                    <label
                                        htmlFor="researchArea"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Research Area
                                    </label>

                                    <div className="relative">
                                        <Search
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        />

                                        <input
                                            id="researchArea"
                                            type="text"
                                            value={researchArea}
                                            onChange={(event) =>
                                                setResearchArea(event.target.value)
                                            }
                                            placeholder="e.g. Artificial Intelligence"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                        />
                                    </div>
                                </div>

                                {/* Designation */}
                                <div>
                                    <label
                                        htmlFor="researcherDesignation"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Designation
                                    </label>

                                    <input
                                        id="researcherDesignation"
                                        type="text"
                                        value={designation}
                                        onChange={(event) =>
                                            setDesignation(event.target.value)
                                        }
                                        placeholder="e.g. Research Scientist"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                    />
                                </div>
                            </>
                        )}

                        {/* MENTOR */}
                        {role === "mentor" && (
                            <>
                                {/* Organization */}
                                <div>
                                    <label
                                        htmlFor="organization"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Organization
                                    </label>

                                    <div className="relative">
                                        <BriefcaseBusiness
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        />

                                        <input
                                            id="organization"
                                            type="text"
                                            value={organization}
                                            onChange={(event) =>
                                                setOrganization(event.target.value)
                                            }
                                            placeholder="Company, startup, or organization"
                                            required
                                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                        />
                                    </div>
                                </div>

                                {/* Expertise */}
                                <div>
                                    <label
                                        htmlFor="expertise"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Area of Expertise
                                    </label>

                                    <input
                                        id="expertise"
                                        type="text"
                                        value={expertise}
                                        onChange={(event) =>
                                            setExpertise(event.target.value)
                                        }
                                        placeholder="e.g. Software Engineering"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                    />
                                </div>

                                {/* Experience */}
                                <div>
                                    <label
                                        htmlFor="experience"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Experience
                                    </label>

                                    <select
                                        id="experience"
                                        value={experience}
                                        onChange={(event) =>
                                            setExperience(event.target.value)
                                        }
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-white/30 focus:bg-white/[0.07]"
                                    >
                                        <option value="" disabled className="bg-black">
                                            Select experience
                                        </option>

                                        <option value="0-2" className="bg-black">
                                            0–2 years
                                        </option>

                                        <option value="3-5" className="bg-black">
                                            3–5 years
                                        </option>

                                        <option value="6-10" className="bg-black">
                                            6–10 years
                                        </option>

                                        <option value="10+" className="bg-black">
                                            10+ years
                                        </option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Location */}
                        <div>
                            <label
                                htmlFor="location"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Location
                            </label>

                            <div className="relative">
                                <MapPin
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    id="location"
                                    type="text"
                                    value={location}
                                    onChange={(event) =>
                                        setLocation(event.target.value)
                                    }
                                    placeholder="City, State"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                />
                            </div>
                        </div>

                        {/* Continue */}
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-200"
                        >
                            Continue
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs leading-5 text-gray-600">
                    You can update these details later from your Academic Passport.
                </p>
            </div>
        </main>
    );
}