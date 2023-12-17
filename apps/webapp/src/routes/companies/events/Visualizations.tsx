import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { orderConverter } from "@/lib/model/orders";
import { EVENT_QUERY, ORDERS_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import useGeneralStore from "@/lib/store/general";
import { getTableLabel } from "@/lib/tables.ts";
import { Article, ArticleColor, Event, Order } from "@order-app/types";
import { ToggleGroup, ToggleGroupItem } from "@order-app/ui";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  collection,
  getDocs,
  getDocsFromCache,
  query,
  where,
} from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  ArcElement,
  ChartDataLabels
);

export default function Visualizations() {
  const { event: eventId } = useParams();
  const { status: eventStatus } = useQuery({
    queryKey: [EVENT_QUERY, eventId],
    enabled: false,
  });
  const theme = useGeneralStore((state) => state.theme);
  ChartJS.defaults.color = theme === "dark" ? "#eee" : "#222";
  ChartJS.defaults.borderColor = theme === "dark" ? "#444" : "#ddd";
  const event: Event | undefined = useEventStore((state) => state.event);

  const { data: orders, status: ordersStatus } = useQuery<Order[]>({
    queryKey: [ORDERS_QUERY, eventId],
    queryFn: async () => {
      const ordersQuery = query(
        collection(db, Collection.Orders).withConverter(orderConverter),
        where("eventId", "==", eventId)
      );
      let snapshots = await getDocsFromCache(ordersQuery);
      if (snapshots.empty) {
        snapshots = await getDocs(ordersQuery);
      }
      return snapshots.docs.map((s) => s.data());
    },
    refetchOnWindowFocus: false,
  });

  const [sortorder, setSortOrder] = useState("asc");
  const [bartype, setBarType] = useState("amount");

  if (eventStatus === "loading") {
    return (
      <div className="grid min-h-[40vh] place-items-center delay-200 duration-500 animate-in fade-in-0 fill-mode-backwards">
        <Loader2Icon className="animate-spin text-border" />
      </div>
    );
  }

  if (!event) {
    return <>event not found</>;
  }

  let title = "";
  let bardata = [0];
  let description = "";

  if (bartype == "amount") {
    title = "Menge";
    description = "Anzahl";
    bardata = event.articles.map(sumAmountsForArticleId);
  } else if (bartype == "revenue") {
    title = "Einnahmen";
    description = "CHF";
    bardata = event.articles.map(getRevenue);
  }

  const labels = event.articles.map((article) => article.displayName);
  let data = {
    labels,
    datasets: [
      {
        label: description,
        data: bardata,
        backgroundColor: event.articles.map((article) => {
          let color = article.customColor;
          if (!color) {
            const category = event.articleCategories.find(
              (c) => c.id === article.category
            );
            color = category!.color;
          }
          return getColor(color);
        }),
        borderColor: event.articles.map((article) => {
          let color = article.customColor;
          if (!color) {
            const category = event.articleCategories.find(
              (c) => c.id === article.category
            );
            color = category!.color;
          }
          return getBorderColor(color);
        }),
        borderWidth: 2,
      },
    ],
  };

  // Daten sortieren
  // Absteigend sortieren
  if (sortorder === "desc") {
    data = JSON.parse(JSON.stringify(data));
    data.labels.sort((a, b) => {
      const dataIndexA = data.labels.indexOf(a);
      const dataIndexB = data.labels.indexOf(b);
      return (
        data.datasets[0].data[dataIndexB] - data.datasets[0].data[dataIndexA]
      );
    });
    data.datasets[0].backgroundColor.sort((a, b) => {
      const dataIndexA = data.datasets[0].backgroundColor.indexOf(a);
      const dataIndexB = data.datasets[0].backgroundColor.indexOf(b);
      return (
        data.datasets[0].data[dataIndexB] - data.datasets[0].data[dataIndexA]
      );
    });
    data.datasets[0].borderColor.sort((a, b) => {
      const dataIndexA = data.datasets[0].borderColor.indexOf(a);
      const dataIndexB = data.datasets[0].borderColor.indexOf(b);
      return (
        data.datasets[0].data[dataIndexB] - data.datasets[0].data[dataIndexA]
      );
    });

    data.datasets.forEach((dataset) => {
      dataset.data.sort((a, b) => b - a);
    });
  }
  // Aufsteigend sortieren
  else if (sortorder == "asc") {
    data = JSON.parse(JSON.stringify(data));
    data.labels.sort((a, b) => {
      const dataIndexA = data.labels.indexOf(a);
      const dataIndexB = data.labels.indexOf(b);
      return (
        data.datasets[0].data[dataIndexA] - data.datasets[0].data[dataIndexB]
      );
    });
    data.datasets[0].backgroundColor.sort((a, b) => {
      const dataIndexA = data.datasets[0].backgroundColor.indexOf(a);
      const dataIndexB = data.datasets[0].backgroundColor.indexOf(b);
      return (
        data.datasets[0].data[dataIndexA] - data.datasets[0].data[dataIndexB]
      );
    });
    data.datasets[0].borderColor.sort((a, b) => {
      const dataIndexA = data.datasets[0].borderColor.indexOf(a);
      const dataIndexB = data.datasets[0].borderColor.indexOf(b);
      return (
        data.datasets[0].data[dataIndexA] - data.datasets[0].data[dataIndexB]
      );
    });

    data.datasets.forEach((dataset) => {
      dataset.data.sort((a, b) => a - b);
    });
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
      datalabels: {
        font: {
          family: "Rubik, system-ui, sans-serif",
          size: 14,
        },
        anchor: "end",
        align: "end",
        offset: 0,
      },
    },
  } as const;

  const tabledata = event.tables.tables.map(sumAmountsForTable);
  const doughnutlabels = event.tables.tables.map(
    (table) =>
      getTableLabel(table.col, event.tables.colLabels) +
      getTableLabel(table.row, event.tables.rowLabels)
  );
  const doughnutdata = {
    labels: doughnutlabels,
    datasets: [
      {
        label: "CHF",
        data: tabledata,
        backgroundColor: [
          "rgba(204, 102, 102, 0.6)",
          "rgba(204, 153, 102, 0.6)",
          "rgba(204, 204, 102, 0.6)",
          "rgba(102, 204, 102, 0.6)",
          "rgba(102, 153, 204, 0.6)",
          "rgba(153, 102, 204, 0.6)",
          "rgba(204, 102, 204, 0.6)",
          "rgba(204, 153, 102, 0.6)",
          "rgba(102, 204, 204, 0.6)",
          "rgba(102, 204, 153, 0.6)",
          "rgba(204, 102, 153, 0.6)",
          "rgba(153, 102, 204, 0.6)",
        ],
        borderColor: [
          "rgb(204, 102, 102)",
          "rgb(204, 153, 102)",
          "rgb(204, 204, 102)",
          "rgb(102, 204, 102)",
          "rgb(102, 153, 204)",
          "rgb(153, 102, 204)",
          "rgb(204, 102, 204)",
          "rgb(204, 153, 102)",
          "rgb(102, 204, 204)",
          "rgb(102, 204, 153)",
          "rgb(204, 102, 153)",
          "rgb(153, 102, 204)",
        ],
        borderWidth: 2,
      },
    ],
  };
  const optionsdonut = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Einnahmen pro Tisch",
      },
      datalabels: {
        font: {
          family: "Rubik, system-ui, sans-serif",
          size: 14,
        },
        offset: 0,
      },
    },
  } as const;

  function sumAmountsForArticleId(art: Article): number {
    let totalAmount = 0;
    const articleId = art.id;

    orders?.forEach((order) => {
      order.items.forEach((item) => {
        if (item.articleId === articleId) {
          totalAmount += item.amount;
        }
      });
    });

    return totalAmount;
  }

  function sumAmountsForTable(table: { row: number; col: number }): number {
    let totalAmount = 0;
    const tableid =
      getTableLabel(table.col, event!.tables.colLabels) +
      getTableLabel(table.row, event!.tables.rowLabels);

    orders?.forEach((order) => {
      order.items.forEach((item) => {
        if (order.table == tableid) {
          let price = 0;
          event!.articles.forEach((article) => {
            if (article.id == item.articleId) {
              price = article.price;
            }
          });
          totalAmount += item.amount * price;
        }
      });
    });

    return totalAmount;
  }

  function getRevenue(art: Article): number {
    const price = art.price;
    const amount = sumAmountsForArticleId(art);
    return price * amount;
  }

  function getColor(color: ArticleColor): string {
    if (color === ArticleColor.White) {
      return "rgba(255,255,255,0.6)";
    } else if (color === ArticleColor.Red) {
      return "rgba(255, 99, 132, 0.6)";
    } else if (color === ArticleColor.Orange) {
      return "rgba(255, 159, 64, 0.6)";
    } else if (color === ArticleColor.Yellow) {
      return "rgba(255, 205, 86, 0.6)";
    } else if (color === ArticleColor.Green) {
      return "rgba(75, 192, 192, 0.6)";
    } else if (color === ArticleColor.Blue) {
      return "rgba(54, 162, 235, 0.6)";
    } else if (color === ArticleColor.Purple) {
      return "rgba(153, 102, 255, 0.6)";
    }
    return "rgba(201, 203, 207, 0.6)";
  }

  function getBorderColor(color: ArticleColor): string {
    if (color === ArticleColor.White) {
      return "rgb(255,255,255)";
    } else if (color === ArticleColor.Red) {
      return "rgb(255, 99, 132)";
    } else if (color === ArticleColor.Orange) {
      return "rgb(255, 159, 64)";
    } else if (color === ArticleColor.Yellow) {
      return "rgb(255, 205, 86)";
    } else if (color === ArticleColor.Green) {
      return "rgb(75, 192, 192)";
    } else if (color === ArticleColor.Blue) {
      return "rgb(54, 162, 235)";
    } else if (color === ArticleColor.Purple) {
      return "rgb(153, 102, 255)";
    }
    return "rgb(201, 203, 207)";
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Auswertung</h2>

      {ordersStatus !== "success" ? (
        <p>Die Bestellungen werden geladen...</p>
      ) : (
        <>
          <h3 className="h2">Nach Artikel</h3>
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <ToggleGroup
              value={bartype}
              onValueChange={(value) => {
                if (value) setBarType(value);
              }}
              type="single"
              variant="outline"
            >
              <ToggleGroupItem value="amount" aria-label="Toggle bold">
                Anzahl
              </ToggleGroupItem>
              <ToggleGroupItem value="revenue" aria-label="Toggle italic">
                Einnahmen
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup
              value={sortorder}
              onValueChange={(value) => {
                if (value) setSortOrder(value);
              }}
              type="single"
              variant="outline"
            >
              <ToggleGroupItem value="asc" aria-label="Toggle bold">
                Aufsteigend
              </ToggleGroupItem>
              <ToggleGroupItem value="desc" aria-label="Toggle italic">
                Absteigend
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="grid aspect-[2/1] place-items-center text-red-400 md:-mx-[10vw] md:w-[calc(100%+20vw)] xl:-mx-[15vw] xl:w-[calc(100%+30vw)]">
            <Bar options={options} data={data} />
          </div>
          <h3 className="h2 mt-8">Nach Tisch</h3>
          <div className="mx-auto aspect-square w-full max-w-md">
            <Doughnut options={optionsdonut} data={doughnutdata} />
          </div>
        </>
      )}
    </div>
  );
}
