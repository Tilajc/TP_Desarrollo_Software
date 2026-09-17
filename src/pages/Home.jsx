import { Button } from '../components/ui/button';

const Home = () => {
  return (
    <section className=" flex flex-col align-middle m-4">
      <h1 className="">This is the home screen</h1>
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button variant="outline">Button</Button>
      </div>
    </section>
  );
};

export default Home;
