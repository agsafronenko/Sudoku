import { gsap } from "gsap";

// Animation for new game/clear board
export const playNewGameAnimation = (boardElement) => {
  if (!boardElement) return;

  // Reset any ongoing animations
  const cells = boardElement.querySelectorAll(".cell");
  gsap.killTweensOf(cells);

  // Reset winning styles
  cells.forEach((cell) => {
    cell.style.backgroundColor = "";
    cell.style.color = "";
    cell.style.fontWeight = "normal";
  });

  // Create a staggered flip animation
  gsap.fromTo(
    cells,
    {
      rotationY: 90,
      opacity: 0,
      scale: 0.8,
    },
    {
      rotationY: 0,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: {
        grid: [9, 9],
        from: "center",
        amount: 0.5,
      },
      ease: "back.out(1.2)",
    }
  );
};

// Animation for winning/solving puzzle
export const playWinAnimation = (boardElement) => {
  if (!boardElement) return;

  const cells = boardElement.querySelectorAll(".cell");

  // Reset any ongoing animations
  gsap.killTweensOf(cells);
  gsap.killTweensOf(boardElement);

  // First animate the whole board
  gsap.to(boardElement, {
    scale: 1.05,
    boxShadow: "0 0 30px rgba(76, 175, 80, 0.6)",
    duration: 0.5,
    yoyo: true,
    repeat: 1,
  });

  // Then animate individual cells in a wave pattern
  gsap.to(cells, {
    backgroundColor: "#a5d6a7",
    color: "#1b5e20",
    fontWeight: "bold",
    duration: 0.4,
    stagger: {
      grid: [9, 9],
      from: "center",
      amount: 1,
    },
    yoyo: true,
    repeat: 1,
    ease: "sine.inOut",
  });
};

// Animation for losing/incorrect solution
export const playLoseAnimation = (boardElement) => {
  if (!boardElement) return;

  const cells = boardElement.querySelectorAll(".cell");

  // Reset any ongoing animations
  gsap.killTweensOf(cells);
  gsap.killTweensOf(boardElement);

  // Shake the board
  gsap.to(boardElement, {
    x: "+=10",
    duration: 0.1,
    repeat: 5,
    yoyo: true,
    ease: "none",
  });

  // Find incorrect cells and highlight them
  const incorrectCells = boardElement.querySelectorAll(".cell.incorrect");

  gsap.to(incorrectCells, {
    backgroundColor: "#ffcdd2",
    scale: 1.1,
    duration: 0.3,
    stagger: 0.05,
    yoyo: true,
    repeat: 1,
  });
};

// Enhanced animation for selecting a cell
export const playCellSelectAnimation = (cellElement, previousCellElement) => {
  if (!cellElement) return;

  // Reset any ongoing animations on both current and previous cells
  gsap.killTweensOf(cellElement);

  // If there was a previously selected cell, reset its styles
  if (previousCellElement && previousCellElement !== cellElement) {
    gsap.to(previousCellElement, {
      scale: 1,
      backgroundColor: "",
      boxShadow: "0 0 0 rgba(33, 150, 243, 0)",
      duration: 0.3,
      ease: "power2.out",
    });
  }

  // Create a ripple effect
  const createRipple = () => {
    // Create ripple element
    const ripple = document.createElement("div");
    ripple.style.position = "absolute";
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    ripple.style.borderRadius = "50%";
    ripple.style.backgroundColor = "rgba(33, 150, 243, 0.4)";
    ripple.style.left = "50%";
    ripple.style.top = "50%";
    ripple.style.transform = "translate(-50%, -50%)";
    ripple.style.pointerEvents = "none";

    // Add the ripple to the cell
    cellElement.style.position = "relative";
    cellElement.style.overflow = "hidden";
    cellElement.appendChild(ripple);

    // Animate the ripple
    gsap.to(ripple, {
      scale: 5,
      opacity: 0,
      duration: 0.8,
      ease: "power1.out",
      onComplete: () => {
        if (ripple.parentNode === cellElement) {
          cellElement.removeChild(ripple);
        }
      },
    });
  };

  // Execute the ripple effect
  createRipple();

  // Animate the cell with a more dramatic effect
  gsap.fromTo(
    cellElement,
    {
      scale: 0.9,
      backgroundColor: "rgba(187, 222, 251, 0.7)",
      boxShadow: "0 0 0 rgba(33, 150, 243, 0)",
    },
    {
      scale: 1,
      backgroundColor: "rgba(187, 222, 251, 0.9)",
      boxShadow: "0 0 15px rgba(33, 150, 243, 0.6)",
      duration: 0.4,
      ease: "elastic.out(1.2, 0.5)",
    }
  );

  // Add a subtle pulsing effect to maintain focus
  gsap.to(cellElement, {
    boxShadow: "0 0 10px rgba(33, 150, 243, 0.3)",
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
};

// Enhanced animation for inputting a number
export const playNumberInputAnimation = (cellElement, isNoteMode = false) => {
  if (!cellElement) return;

  // Reset any ongoing animations
  gsap.killTweensOf(cellElement);

  if (isNoteMode) {
    // Enhanced animation for notes mode
    const noteItems = cellElement.querySelectorAll(".note-item.visible");

    // Scatter and fade in effect
    gsap.fromTo(
      noteItems,
      {
        scale: 0,
        opacity: 0,
        y: -10,
        rotation: gsap.utils.random(-30, 30),
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: "back.out(2)",
      }
    );

    // Add a brief highlight to the cell
    gsap.fromTo(
      cellElement,
      {
        backgroundColor: "rgba(187, 243, 187, 0.5)",
      },
      {
        backgroundColor: "",
        duration: 0.6,
        ease: "power2.out",
      }
    );
  } else {
    // Enhanced animation for regular number input
    const valueElement = cellElement.querySelector(".value");
    if (valueElement) {
      // Create a temporary overlay for a flash effect
      const flash = document.createElement("div");
      flash.style.position = "absolute";
      flash.style.width = "100%";
      flash.style.height = "100%";
      flash.style.backgroundColor = "rgba(63, 81, 181, 0.3)";
      flash.style.top = "0";
      flash.style.left = "0";
      flash.style.borderRadius = "4px";
      flash.style.pointerEvents = "none";

      cellElement.style.position = "relative";
      cellElement.appendChild(flash);

      // Animate the flash
      gsap.to(flash, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          if (flash.parentNode === cellElement) {
            cellElement.removeChild(flash);
          }
        },
      });

      // 3D rotation effect for the number
      gsap.fromTo(
        valueElement,
        {
          scale: 0,
          opacity: 0,
          rotationY: 180,
          color: "#3f51b5",
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          color: "#1a237e",
          duration: 0.5,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Bounce after appearing
            gsap.to(valueElement, {
              y: -3,
              duration: 0.15,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
              onComplete: () => {
                // Reset color after animation
                gsap.to(valueElement, {
                  color: "",
                  duration: 0.3,
                  delay: 0.2,
                });
              },
            });
          },
        }
      );
    }
  }
};

// Animation for hint revealed
export const playHintAnimation = (cellElement) => {
  if (!cellElement) return;

  // Reset any ongoing animations
  gsap.killTweensOf(cellElement);

  gsap.fromTo(
    cellElement,
    {
      backgroundColor: "#a5d6a7",
      scale: 1.1,
    },
    {
      backgroundColor: "",
      scale: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    }
  );

  const valueElement = cellElement.querySelector(".value");
  if (valueElement) {
    gsap.fromTo(
      valueElement,
      {
        scale: 0,
        opacity: 0,
        color: "#1b5e20",
      },
      {
        scale: 1,
        opacity: 1,
        color: "#1b5e20",
        duration: 0.4,
        delay: 0.1,
      }
    );
  }
};
