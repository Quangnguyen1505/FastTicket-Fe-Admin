import { SnackRequestCreate, SnackRequestUpdate } from "@/types/snack";

export function convertSnackFormData(snack: SnackRequestCreate): FormData {
  const formData = new FormData();

  if (snack.file instanceof File) {
    formData.append('file', snack.file);
  }
  formData.append("item_name", snack.item_name);
  formData.append("item_price", snack.item_price.toString());
  formData.append("quantity_available", snack.quantity_available.toString());
  formData.append("category", snack.category?.toString() ?? '');

  return formData;
}

export function convertSnackUpdateFormData(snack: SnackRequestUpdate): FormData {
  const formData = new FormData();

  if (snack.file instanceof File) {
    formData.append("file", snack.file);
  }

  if (snack.item_name) {
    formData.append("item_name", snack.item_name);
  }

  if (typeof snack.item_price === "number") {
    formData.append("item_price", snack.item_price.toString());
  }

  if (typeof snack.quantity_available === "number") {
    formData.append("quantity_available", snack.quantity_available.toString());
  }

  if (snack.category !== null && snack.category !== undefined) {
    formData.append("category", snack.category.toString());
  }

  return formData;
}