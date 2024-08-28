import { Box, Modal, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

const SondageDetailsModal = ({ sondage, open, onClose }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!sondage) return null;

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Display title based on user role */}
        {sondage.user.role === "Client" ? (
          <h2>
            C'est un produit suggéré par {sondage.user.first_name}{" "}
            {sondage.user.name}
          </h2>
        ) : (
          <h2>{sondage.nom_produit}</h2>
        )}

        <p>
          <strong>Description:</strong> {sondage.description}
        </p>
        <p>
          <strong>Question:</strong> {sondage.question}
        </p>
        <div>
          <strong>Photos:</strong>
          {sondage.urlsPhotos && sondage.urlsPhotos.length > 0 ? (
            <div>
              {/* Buttons to select photos */}
              <div>
                {sondage.urlsPhotos.map((url, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    color={"primary"}
                    onClick={() => handlePhotoClick(index)}
                    sx={{ marginRight: 1, marginBottom: 1 }}
                  >
                    Photo {index + 1}
                  </Button>
                ))}
              </div>

              {/* Display the selected photo */}
              <img
                src={sondage.urlsPhotos[selectedPhotoIndex]}
                alt={`Photo ${selectedPhotoIndex + 1}`}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "300px",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            </div>
          ) : (
            <p>Aucune photo disponible</p>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default SondageDetailsModal;
