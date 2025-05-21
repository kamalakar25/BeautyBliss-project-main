// import React, { useState } from "react";
// import { Box, Slider } from "@mui/material";
// import beforeskin from '../assets/beforeskin.jpg'; // Adjust path as needed
// import afterskin from '../assets/afterskin.png';   // Adjust path as needed

// const SkinTransformation = () => {
//   const [sliderPosition, setSliderPosition] = useState(50);

//   const handleSliderChange = (e, newValue) => {
//     setSliderPosition(newValue);
//   };

//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         width: '90%',
//         maxWidth: '500px',
//         margin: '40px auto',
//         touchAction: 'none',
//         padding: { xs: '15px', sm: '20px' }, // Responsive padding
//         border: '6px solid #f5f5f5',
//         borderRadius: '15px',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
//         transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//         '&:hover': {
//           transform: 'scale(1.02)',
//           boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
//         },
//       }}
//     >
//       <Box
//         sx={{
//           position: 'relative',
//           width: '100%',
//           borderRadius: '10px',
//           aspectRatio: '4/3',
//           overflow: 'hidden',
//         }}
//       >
//         {/* After Image */}
//         <Box
//           component="img"
//           src={afterskin}
//           alt="after skin"
//           sx={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//             objectPosition: 'top center',
//             userSelect: 'none',
//             pointerEvents: 'none',
//             borderRadius: '10px',
//             display: 'block',
//           }}
//         />

//         {/* Before Image */}
//         <Box
//           component="img"
//           src={beforeskin}
//           alt="before skin"
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//             objectPosition: 'top center',
//             clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
//             transition: 'clip-path 0.2s ease-out',
//             userSelect: 'none',
//             pointerEvents: 'none',
//             borderRadius: '10px',
//             display: 'block',
//           }}
//         />

//         {/* Slider Line */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             bottom: 0,
//             left: `${sliderPosition}%`,
//             width: '3px',
//             backgroundColor: 'white',
//             transform: 'translateX(-50%)',
//             zIndex: 2,
//             transition: 'left 0.2s ease-out',
//             pointerEvents: 'none',
//           }}
//         />

//         {/* Before Label */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '8px',
//             left: '12px',
//             backgroundColor: 'rgba(0,0,0,0.7)',
//             color: 'white',
//             padding: '3px 8px',
//             borderRadius: '5px',
//             fontSize: '12px',
//             fontWeight: 'bold',
//             zIndex: 4,
//             backdropFilter: 'blur(4px)',
//           }}
//         >
//           Before
//         </Box>

//         {/* After Label */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '8px',
//             right: '12px',
//             backgroundColor: 'rgba(0,0,0,0.7)',
//             color: 'white',
//             padding: '3px 8px',
//             borderRadius: '5px',
//             fontSize: '12px',
//             fontWeight: 'bold',
//             zIndex: 4,
//             backdropFilter: 'blur(4px)',
//           }}
//         >
//           After
//         </Box>

//         {/* Slider Input */}
//         <Slider
//           value={sliderPosition}
//           onChange={handleSliderChange}
//           min={0}
//           max={100}
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             opacity: 0,
//             zIndex: 3,
//             cursor: 'ew-resize',
//             '& .MuiSlider-thumb': { display: 'none' }, // Hide thumb
//             '& .MuiSlider-track': { display: 'none' }, // Hide track
//             '& .MuiSlider-rail': { display: 'none' },   // Hide rail
//           }}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default SkinTransformation;