import { ApartmentPreview } from "@/components/ApartmentPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: {
    email: string;
    leftWallColor: string;
    rightWallColor: string;
    selectedSofa: string;
    selectedMirror: string;
    votes: number;
  } | null;
}

export const ApartmentModal = ({
  isOpen,
  onClose,
  apartment,
}: ApartmentModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (!apartment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {apartment.email}&apos;s Apartment
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="w-full max-w-[500px] aspect-square">
            <ApartmentPreview
              leftWallColor={apartment.leftWallColor}
              rightWallColor={apartment.rightWallColor}
              selectedSofa={apartment.selectedSofa}
              selectedMirror={apartment.selectedMirror}
              className="w-full h-full"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Votes: <span className="font-bold text-lg">{apartment.votes}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 