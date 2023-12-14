import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { orderConverter } from "@/lib/model/orders";
import { EVENT_QUERY, ORDERS_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import {Article, ArticleColor, Event, Order} from "@order-app/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@order-app/ui"

import {Bar, Doughnut} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors,
    ArcElement
);





export default function Visualizations() {
  const { event: eventId } = useParams();
  const { status: eventStatus } = useQuery({
    queryKey: [EVENT_QUERY, eventId],
    enabled: false,
  });
  const event: Event | undefined = useEventStore((state) => state.event);

  const { data: orders, status: ordersStatus } = useQuery<Order[]>({
    queryKey: [ORDERS_QUERY, eventId],
    queryFn: async () => {
      const ordersQuery = query(
          collection(db, Collection.Orders).withConverter(orderConverter),
          where("eventId", "==", eventId)
      );
      const snapshots = await getDocs(ordersQuery);
      return snapshots.docs.map((s) => s.data());
    },
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
    title = "Menge"
    description = "Anzahl";
    bardata = event.articles.map(sumAmountsForArticleId);
  }
  else if (bartype == "revenue") {
    title = "Einnahmen"
    description = "CHF";
    bardata = event.articles.map(getRevenue);
  }

  const labels = event.articles.map(article => article.displayName);
  let data = {
    labels,
    datasets: [{
      label : description,
      data: bardata,
      backgroundColor: event.articles.map(article => {let color = article.customColor
        if (!color) {const category = event.articleCategories.find(c => c.id === article.category);
          color = category!.color}
        return getColor(color)}),
      borderColor: event.articles.map(article => {let color = article.customColor
        if (!color) {const category = event.articleCategories.find(c => c.id === article.category);
          color = category!.color}
        return getBorderColor(color)}),
      borderWidth: 2
    }]
  };

    // Daten sortieren
  // Absteigend sortieren
  if (sortorder === "desc") {
    data = JSON.parse(JSON.stringify(data));
    data.labels.sort((a, b) => {
      const dataIndexA = data.labels.indexOf(a);
      const dataIndexB = data.labels.indexOf(b);
      return data.datasets[0].data[dataIndexB] - data.datasets[0].data[dataIndexA];
    });
    data.datasets[0].backgroundColor.sort((a, b) => {
      const dataIndexA = data.datasets[0].backgroundColor.indexOf(a);
      const dataIndexB = data.datasets[0].backgroundColor.indexOf(b);
      return data.datasets[0].data[dataIndexB] - data.datasets[0].data[dataIndexA];
    });
    data.datasets[0].borderColor.sort((a, b) => {
      const dataIndexA = data.datasets[0].borderColor.indexOf(a);
      const dataIndexB = data.datasets[0].borderColor.indexOf(b);
      return data.datasets[0].data[dataIndexB] - data.datasets[0].data[dataIndexA];
    });

    data.datasets.forEach(dataset => {
      dataset.data.sort((a, b) => b - a);
    });
  }
  // Aufsteigend sortieren
  else if (sortorder == "asc") {
    data = JSON.parse(JSON.stringify(data));
    data.labels.sort((a, b) => {
      const dataIndexA = data.labels.indexOf(a);
      const dataIndexB = data.labels.indexOf(b);
      return data.datasets[0].data[dataIndexA] - data.datasets[0].data[dataIndexB];
    });
    data.datasets[0].backgroundColor.sort((a, b) => {
      const dataIndexA = data.datasets[0].backgroundColor.indexOf(a);
      const dataIndexB = data.datasets[0].backgroundColor.indexOf(b);
      return data.datasets[0].data[dataIndexA] - data.datasets[0].data[dataIndexB];
    });
    data.datasets[0].borderColor.sort((a, b) => {
      const dataIndexA = data.datasets[0].borderColor.indexOf(a);
      const dataIndexB = data.datasets[0].borderColor.indexOf(b);
      return data.datasets[0].data[dataIndexA] - data.datasets[0].data[dataIndexB];
    });

    data.datasets.forEach(dataset => {
      dataset.data.sort((a, b) => a - b);
    });
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display:false,
      },
      title: {
        display: true,
        text: title,
      }
    },
  };

  function sumAmountsForArticleId(art:Article): number {
    let totalAmount = 0;
    const articleId = art.id;

    orders?.forEach(order => {
      order.items.forEach(item => {
        if (item.articleId === articleId) {
          totalAmount += item.amount;
        }
      });
    });

    return totalAmount;
  }
  
  function getRevenue(art:Article) : number {
    const price = art.price;
    const amount = sumAmountsForArticleId(art);
    return price * amount;
    
  }

  function getColor(color:ArticleColor) : string {
    if (color === ArticleColor.White) {
      return 'rgba(255,255,255,0.6)';
    }
    else if (color === ArticleColor.Red) {
      return 'rgba(255, 99, 132, 0.6)';
    }
    else if (color === ArticleColor.Orange) {
      return 'rgba(255, 159, 64, 0.6)';
    }
    else if (color === ArticleColor.Yellow) {
      return 'rgba(255, 205, 86, 0.6)';
    }
    else if (color === ArticleColor.Green) {
      return 'rgba(75, 192, 192, 0.6)';
    }
    else if (color === ArticleColor.Blue) {
      return 'rgba(54, 162, 235, 0.6)';
    }
    else if (color === ArticleColor.Purple) {
      return 'rgba(153, 102, 255, 0.6)';
    }
    return 'rgba(201, 203, 207, 0.6)';
  }


  function getBorderColor(color:ArticleColor) : string {
    if (color === ArticleColor.White) {
      return 'rgba(255,255,255)';
    }
    else if (color === ArticleColor.Red) {
      return 'rgba(255, 99, 132)';
    }
    else if (color === ArticleColor.Orange) {
      return 'rgba(255, 159, 64)';
    }
    else if (color === ArticleColor.Yellow) {
      return 'rgba(255, 205, 86)';
    }
    else if (color === ArticleColor.Green) {
      return 'rgba(75, 192, 192)';
    }
    else if (color === ArticleColor.Blue) {
      return 'rgba(54, 162, 235)';
    }
    else if (color === ArticleColor.Purple) {
      return 'rgba(153, 102, 255)';
    }
    return 'rgba(201, 203, 207)';
  }


  return (
      <div className="flex flex-col gap-4">
        <h2 className="h1">Auswertung</h2>

        {ordersStatus !== "success" ? (
            <p>Die Bestellungen werden geladen...</p>
        ) : (

        <div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <ToggleGroup value={bartype} onValueChange={(value) => { if (value) setBarType(value);}} type="single">
              <ToggleGroupItem value="amount" aria-label="Toggle bold">
                Anzahl
              </ToggleGroupItem>
              <ToggleGroupItem value="revenue" aria-label="Toggle italic">
                Einnahmen
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup value={sortorder} onValueChange={(value) => { if (value) setSortOrder(value);}} type="single">
              <ToggleGroupItem value="asc" aria-label="Toggle bold">
                Aufsteigend
              </ToggleGroupItem>
              <ToggleGroupItem value="desc" aria-label="Toggle italic">
                Absteigend
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        <Bar options={options} data={data} />
          <Doughnut options={options} data={data} />
        </div>
      )}
      </div>
  );
}

