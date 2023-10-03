import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "../ui/button";

export default function DeleteHotelDialog({
  open,
  hotelId,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  hotelId: string;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["delete-hotel", hotelId],
    mutationFn: () => api.deleteHotel(undefined, { params: { id: hotelId } }),
    onSuccess() {
      onOpenChange(false);
      toast.success("Hotel deleted successfully");
      onSuccess?.();
    },
    onError(error) {
      let message = "Something went wrong while deleting hotel";

      if (error instanceof AxiosError && error.response?.data.error.message) {
        message = error.response.data.error.message;
      }
      toast.error(message);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-cal-sans">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete hotel.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-red-500 text-white hover:bg-red-600 focus:bg-red-600"
              disabled={isLoading}
              onClick={async () => await mutateAsync()}
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
