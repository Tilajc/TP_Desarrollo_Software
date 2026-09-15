import { getSubjects } from '../services/subject.js';

function Subjects() {
  console.log(getSubjects());

  return (
    <section className="flex flex-col align-middle m-4">
      <h1 className="">This is the subjects screen</h1>
    </section>
  );
}

export default Subjects;
