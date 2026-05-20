import { Textarea } from '../components/ui/textarea.jsx';
import { Button } from '../components/ui/button.jsx';

const Summary = () => {
  return (
    <>
      <div className="summary">
        <h1>Nuevo resumen</h1>
        <p>Escribí tu resumen acá.</p>

        <Textarea placeholder="Escribí tu resumen..." />
      </div>
      <Button>Guardar</Button>
    </>
  );
};

export default Summary;
