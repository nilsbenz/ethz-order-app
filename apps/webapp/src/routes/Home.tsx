import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@order-app/ui";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Home</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
        fugit consectetur deleniti deserunt maxime doloremque possimus
        consequuntur, facere odit id quo provident nihil mollitia quod assumenda
        dignissimos laboriosam in! Ab, magnam! Quisquam officiis necessitatibus
        possimus sunt voluptatem dignissimos. Aspernatur obcaecati repellat
        neque saepe reprehenderit consequuntur porro corrupti mollitia aperiam
        voluptate?
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-fit">Open dialog</Button>
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
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla aliquid
        ab temporibus ad, unde minima placeat velit dolor fugiat, laboriosam
        reiciendis repellendus adipisci illum commodi illo suscipit dicta
        laudantium id omnis distinctio, facilis asperiores libero consequatur
        quisquam. Eveniet, eius quo!
      </p>
      <h3 className="h2">Untertitel</h3>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi, ab
        voluptate voluptatem iure corrupti cumque perferendis asperiores vero
        aliquid saepe aliquam autem quo dolorum dolore nesciunt laudantium magni
        id dolor harum eius maiores ipsa quis? Nam error vel eum sed ipsum. Iure
        minus culpa, deserunt nam omnis natus quasi nulla dolor alias reiciendis
        possimus ipsam ipsum eaque laborum dolorum esse?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel et labore
        odit? Dolores natus at nulla optio tempora eius libero quisquam tempore
        facilis. Enim, sunt. Totam labore quidem sapiente placeat ullam
        blanditiis nihil cupiditate id? Dolore explicabo voluptatum perferendis
        architecto!
      </p>
    </div>
  );
}
