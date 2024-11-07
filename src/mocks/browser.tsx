import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { data } from "../data/data";
import { ProductType } from "../types/types";

interface SaveRequestBody {
  data: ProductType[];
}

export async function isMockServiceEnabled() {
  const worker = setupWorker(
    // Handler for getting product list
    http.get("/data", () => {
      const savedData = localStorage.getItem("savedData");
      if (!savedData) {
        localStorage.setItem("savedData", JSON.stringify(data));
      }
      const responseData = JSON.parse(
        localStorage.getItem("savedData") || "[]",
      );
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }),

    // Handler for saving product list
    http.post("/api/save", async ({ request }) => {
      const { data } = (await request.json()) as SaveRequestBody;
      localStorage.setItem("savedData", JSON.stringify(data));
      return HttpResponse.json({
        success: true,
        message: "Data saved successfully",
      });
    }),

    // Handler for adding a new item
    http.post("/api/add", async ({ request }) => {
      const newItem = await request.json();
      const savedData = JSON.parse(localStorage.getItem("savedData") || "[]");
      savedData.push(newItem);
      localStorage.setItem("savedData", JSON.stringify(savedData));
      return HttpResponse.json({
        success: true,
        message: "Item added successfully",
      });
    }),

    // Handler for updating an item
    // http.put("/api/update/:id", async ({ request, params }) => {
    //   const updatedItem = await request.json();
    //   const savedData = JSON.parse(localStorage.getItem("savedData") || "[]");
    //   const itemIndex = savedData.findIndex(
    //     (item: any) => item.id === params.id,
    //   );

    //   if (itemIndex !== -1) {
    //     savedData[itemIndex] = { ...savedData[itemIndex], ...updatedItem };
    //     localStorage.setItem("savedData", JSON.stringify(savedData));
    //     return HttpResponse.json({
    //       success: true,
    //       message: "Item updated successfully",
    //     });
    //   } else {
    //     return new Response("Item not found", { status: 404 });
    //   }
    // }),

    // Handler for deleting an item
    http.delete("/api/delete/:id", ({ params }) => {
      const savedData = JSON.parse(localStorage.getItem("savedData") || "[]");
      const filteredData = savedData.filter(
        (item: any) => item.id !== params.id,
      );
      localStorage.setItem("savedData", JSON.stringify(filteredData));

      return HttpResponse.json({
        success: true,
        message: "Item deleted successfully",
      });
    }),
  );
  return worker.start();
}
