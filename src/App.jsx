import { Button } from './components/ui/button';
import { useEffect, useState, useContext } from 'react';
import { MyContext } from './context/MyContext';
import useCounter from './components/customHooks/useCounter';

function App() {
  // count es una variable de estado que se inicializa en 0 y
  // setCount es una función que se utiliza para actualizar el valor de count.
  const [count, setCount] = useState(0);

  const [characters, setCharacters] = useState([]);

  const { data, setData } = useContext(MyContext);

  let count2 = 0;

  const { hookCount, increment, decrement } = useCounter();

  const title =
    'Esto es un ejemplo para que puedan aprender lo básico de React';

  // useEffect se ejecuta cada vez que se renderiza el componente por primera vez
  // o cada vez que cambia el valor de count.
  // eso te lo dice el array de dependencias, que en este caso es [count, count2].
  useEffect(() => {
    console.log(count);
    console.log(count2);
  }, [count, count2]);
  // Se preguntaran par que quiero algo que se ejecute algo al inicio del render o cuando algun valor cambie.
  // Esto es muy útil para hacer peticiones a una API, o para hacer algo cuando el usuario haga clic en un botón, o para hacer algo cuando el usuario escriba en un input, etc.

  // useEffect(() => {
  //   // Definimos la función asíncrona dentro
  //   const fetchCharacters = async () => {
  //     try {
  //       const response = await fetch(
  //         'https://rickandmortyapi.com/api/character'
  //       );

  //       // Verificamos si la respuesta es correcta (status 200-299)
  //       if (!response.ok) throw new Error('Error en la petición');

  //       const data = await response.json();

  //       setCharacters(data.results);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchCharacters();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://rickandmortyapi.com/api/character'
        );

        const charactersData = await response.json();

        setCharacters(charactersData.results);
      } catch {
        return 'Failed to fetch';
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <section className="bg-black flex flex-col items-center text-white ">
        {/* como pueden ver la constante si se puede utilizar fuera de un state ya que el problema
        es con el cambio en la pagina para un rerenderizado */}
        <h1 className="text-3xl font-bold">{title}</h1>
        <h2>Ejemplo con useState</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            className="text-black"
            variant="outline"
            // set count actualiza el estado de count. Rerenderizando el componente cada vez que se actualiza el mismo.
            onClick={() => setCount(count - 1)}
          >
            -
          </Button>
          {/* las llaves son para utilizar el valor de la variable */}
          <p className="text-white">{count}</p>
          <Button
            className="text-black"
            variant="outline"
            onClick={() => setCount(count + 1)}
          >
            +
          </Button>
        </div>
        {/* como pueden ver, el ejemplo sin useState no funciona porque no se actualiza el valor
        de count2, mientras que el ejemplo con useState sí funciona porque se actualiza el valor
        de count cada vez que se hace clic en los botones. */}
        <h2>Ejemplo sin useState</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            className="text-black"
            variant="outline"
            onClick={() => (count2 = count2 - 1)}
          >
            -
          </Button>
          <p className="text-white">{count2}</p>
          <Button
            className="text-black"
            variant="outline"
            onClick={() => (count2 = count2 + 1)}
          >
            +
          </Button>
        </div>
        <h2>Ejemplo con custom hook</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button className="text-black" variant="outline" onClick={decrement}>
            -
          </Button>
          <p className="text-white">{hookCount}</p>
          <Button className="text-black" variant="outline" onClick={increment}>
            +
          </Button>
        </div>
        <div>
          <h2>Ejemplo context</h2>
          <p>{data}</p>
          <Button
            className="text-black"
            variant="outline"
            onClick={() => setData('Valor actualizado Global')}
          >
            Actualizar Context
          </Button>
        </div>
      </section>
      {/* <section className="bg-gray-800 flex flex-col items-center text-white">
        <h2 className="text-3xl font-bold">Personajes de Rick and Morty</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {characters.map((character) => (
            <p className="text-white">{character.name}</p>
          ))}
        </div>
      </section> */}
      <section className="bg-gray-800 flex flex-col items-center text-white">
        <ul>
          {characters.map((character) => {
            return <li className="text-2xl text-white">{character.name}</li>;
          })}
        </ul>
      </section>
    </>
  );
}

export default App;
