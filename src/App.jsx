import { Button } from './components/ui/button';

function App() {
  return (
    <>
      <section className="bg-black flex flex-col align-middle">
        <h1 className="text-red-800">Hi</h1>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button variant="outline">Button</Button>
        </div>
      </section>
    </>
  );
}

export default App;
