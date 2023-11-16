import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@order-app/ui";
import { AppUser } from "order-app";

function App() {
  const test: AppUser = { username: "4" };

  console.log(test);

  return (
    <div className="grid min-h-[40rem] place-items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Hello world</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>This is a dialog.</DialogHeader>
          <DialogDescription>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores
            officiis quae quas temporibus vel, optio nulla ab quibusdam sint
            perferendis et veniam asperiores dolor. Aperiam in, distinctio
            quisquam ea cupiditate debitis incidunt adipisci, at est minus
            iusto? Praesentium, quisquam delectus?
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
