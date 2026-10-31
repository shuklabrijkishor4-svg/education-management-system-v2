import { Link } from "react-router-dom";
import { Online } from "../config.js";
import useCourses from "../useCourses.js";
import NoticeBoard from "../components/NoticeBoard.jsx";

function Home() {
  const { courses, loading, error } = useCourses();

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Welcome to {Online.name}</h1>
          <p className="hero-text">
            Learn computer skills step by step from trained teachers, in small
            batches, at a fee every family can afford.
          </p>
          <Link to="/enquiry" className="btn btn-accent">Student Enquiry</Link>
        </div>
      </section>

      <NoticeBoard />

      <section className="section">
        <div className="container about">
          <div>
            <h2>About the institute</h2>
            <p>
              {Online.name} helps school students, college students,
              job seekers and working people learn computers with confidence.
              Every class is practical: you work on a computer in every session.
            </p>
            <p>
              Morning, afternoon and evening batches are available, so you can
              learn without disturbing your studies or your job.
            </p>
          </div>
          <ul className="facts">
            <li><strong>Practical classes</strong>Hands-on work on a computer every day</li>
            <li><strong>Small batches</strong>Personal attention for each student</li>
            <li><strong>Flexible timings</strong>Morning, afternoon and evening</li>
          </ul>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>Our courses</h2>
          <p className="section-intro">Choose the course that fits your goal.</p>
          {loading && <p className="section-intro">Loading courses...</p>}
          {error && <div className="alert alert-error">{error}</div>}
          {!loading && !error && courses.length === 0 && (
            <p className="section-intro">Courses will be announced soon.</p>
          )}

          <div className="course-grid">
            {courses.map((course) => (
              <article className="course" key={course._id}>
                <h3>{course.name || course.title}</h3>
                {course.fullName && <p className="course-full">{course.fullName}</p>}
                {course.description && <p>{course.description}</p>}
                {course.duration && <p className="course-duration">Duration: {course.duration}</p>}
                {course.fees > 0 && (
                  <p className="course-duration">Fees: &#8377;{course.fees.toLocaleString("en-IN")}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <h2>Ready to start learning?</h2>
          <p>Fill in the enquiry form and we will call you back.</p>
          <Link to="/enquiry" className="btn btn-accent">Student Enquiry</Link>
        </div>
      </section>
    </>
  );
}

export default Home;