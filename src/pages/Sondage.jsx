import React, { useState } from "react";
import Header from "../components/Header";
import { Modal, Box } from "@mui/material";
import SondageForm from "../components/SondageForm"; // Assurez-vous que le chemin est correct

const Sondage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Header text={"Sondage"} />
      <div className="px-8">
        <div className="flex justify-end">
          <button
            className="text-center mb-4 font-semibold text-base bg-customBlue px-[93px] text-white py-3 hover:bg-blue-600 mt-28 rounded-xl"
            onClick={handleOpen}
          >
            Créer un sondage
          </button>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <SondageForm handleClose={handleClose} />
        </Box>
      </Modal>
    </div>
  );
};

export default Sondage;
