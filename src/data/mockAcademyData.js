export const academyModules = [
  {
    id: 'car-electrical-basics',
    title: 'Car Electrical Basics & Wiring',
    difficulty: 'Beginner',
    duration: '2 Hours',
    category: 'Electrical Basics',
    image: 'https://images.unsplash.com/photo-1618334460592-7a716eb303b7?q=80&w=1200&auto=format&fit=crop',
    description: 'Understand voltage, current, resistance, Ohm\'s law, relays, fuses, and automotive wiring diagrams.',
    content: `
### Automotive Electrical Fundamentals
Every modern vehicle relies on a 12V DC (Direct Current) system, transitioning to 48V for mild hybrids, and up to 800V for EVs. Understanding the basics is crucial for any diagnostics.
- **Voltage (V):** Electrical pressure. Usually 12.6V when the car is off, and 13.5V - 14.5V when the alternator is running.
- **Current (A):** The flow of electrons. Measured in Amperes.
- **Resistance (Ω):** Opposition to current flow. High resistance (corrosion, loose grounds) is the #1 cause of electrical gremlins.

### Relays and Fuses
- **Fuses:** Sacrificial devices that blow to protect wiring from melting during a short circuit.
- **Relays:** Electromechanical switches that allow a low-current circuit (like a tiny dashboard switch) to control a high-current circuit (like a radiator fan or starter motor).

### Reading Wiring Diagrams
To diagnose effectively, you must learn to trace a circuit from the power source (Battery/Fuse), through the switch, to the load (e.g., a lightbulb), and finally to ground. Remember: *A circuit must have a complete path to ground to work.*
    `,
    tools_recommended: [
      { id: 't_101', name: 'Digital Multimeter (Auto-Ranging)', price: 4500, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&auto=format&fit=crop' },
      { id: 't_102', name: 'Automotive Test Light / Power Probe', price: 8500, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop' }
    ],
    service_available: false
  },
  {
    id: 'sensors-actuators',
    title: 'Sensors & Actuators',
    difficulty: 'Intermediate',
    duration: '3 Hours',
    category: 'Electrical Basics',
    image: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?q=80&w=1200&auto=format&fit=crop',
    description: 'How the ECU gathers data (Inputs) and controls the engine (Outputs). MAF, MAP, O2 sensors, and injectors.',
    content: `
### The Brain\'s Senses: Sensors (Inputs)
The ECU needs to know exactly what the engine and driver are doing. It relies on sensors:
- **Mass Air Flow (MAF) / Manifold Absolute Pressure (MAP):** Measures how much air is entering the engine to calculate fuel needs.
- **Crankshaft Position Sensor (CKP):** Tells the ECU engine speed (RPM) and exact piston position to time the spark and fuel injection.
- **Oxygen (O2) Sensor / Wideband:** Placed in the exhaust to measure unburnt oxygen. Tells the ECU if the mixture was too rich or too lean (Closed Loop Control).
- **Throttle Position Sensor (TPS):** Measures how far the driver has pressed the accelerator.

### The Brain\'s Muscles: Actuators (Outputs)
Based on sensor data, the ECU commands actuators to do the physical work:
- **Fuel Injectors:** Solenoids that spray pressurized fuel into the intake or cylinder.
- **Ignition Coils:** Transform 12V into 30,000V+ to fire the spark plugs.
- **Electronic Throttle Body (ETB):** A motor that opens the throttle plate (Drive-by-Wire).
- **VVT Solenoids:** Control oil pressure to alter camshaft timing on the fly.
    `,
    tools_recommended: [
      { id: 't_103', name: 'Sensor Simulator & Tester', price: 12000, image: 'https://images.unsplash.com/photo-1599256621730-535171e28f87?q=80&w=400&auto=format&fit=crop' }
    ],
    service_available: true
  },
  {
    id: 'engine-control-systems',
    title: 'Engine Control Systems',
    difficulty: 'Intermediate',
    duration: '3.5 Hours',
    category: 'Core Systems',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
    description: 'The internal logic of Engine Management. Open Loop vs Closed Loop, Fuel Trims, and Ignition Timing.',
    content: `
### Engine Control Logic
The primary job of the Engine Control Unit (ECU) is to maintain the perfect air/fuel ratio (Stoichiometry) while maximizing power and minimizing emissions.

### Open Loop vs. Closed Loop
- **Open Loop:** Used during cold starts (warming up the catalytic converter) and Wide Open Throttle (WOT). The ECU ignores O2 sensor feedback and relies strictly on pre-programmed fuel maps.
- **Closed Loop:** Used during normal cruising and idling. The ECU uses O2 sensor data to constantly adjust the fuel mixture in real-time.

### Fuel Trims: Short Term vs. Long Term
Fuel trims are the ECU's way of correcting for wear and tear (e.g., a vacuum leak or weak fuel pump).
- **Short Term Fuel Trim (STFT):** Immediate, rapid adjustments. Bounces between -5% and +5%.
- **Long Term Fuel Trim (LTFT):** Learned behavior over time. If STFT is constantly adding +10% fuel due to a vacuum leak, LTFT will eventually shift to +10% so STFT can return to zero. If total trims exceed ~25%, a Check Engine Light (P0171/P0172) is triggered.
    `,
    tools_recommended: [
      { id: 't_006', name: 'Professional Bi-Directional OBD2 Scanner', price: 28500, image: 'https://images.unsplash.com/photo-1599256621730-535171e28f87?q=80&w=400&auto=format&fit=crop' }
    ],
    service_available: true
  },
  {
    id: 'transmission-control',
    title: 'Transmission Control (TCU/TCM)',
    difficulty: 'Advanced',
    duration: '3 Hours',
    category: 'Core Systems',
    image: 'https://images.unsplash.com/photo-1555664424-778d1e573bf3?q=80&w=1200&auto=format&fit=crop',
    description: 'Automatic, CVT, and DCT control logic. Shift schedules, torque converter lockup, and clutch adaptation.',
    content: `
### The Transmission Control Module (TCM)
Modern transmissions (Automatics, CVTs, Dual Clutch/DCTs) are fully computer-controlled. The TCM works in tandem with the ECU via the CAN Bus. 

### Shift Scheduling & Torque Reduction
The TCM monitors throttle position, vehicle speed, and engine load to determine the optimal gear. During a gear shift, the TCM sends a "Torque Reduction Request" over the CAN Bus to the ECU. The ECU momentarily retards ignition timing to cut power, allowing the transmission clutches to engage smoothly without slipping or banging.

### CVT and DCT Specifics
- **CVT (Continuously Variable Transmission):** The TCM controls hydraulic pressure to constantly adjust the width of two pulleys, changing the gear ratio infinitely.
- **DCT (Dual Clutch Transmission):** Uses two separate clutches (one for odd gears, one for even). The TCM pre-selects the next gear and simply swaps clutches for lightning-fast shifts. DCTs require complex "adaptation" procedures via a scan tool to learn clutch wear over time.
    `,
    tools_recommended: [],
    service_available: true
  },
  {
    id: 'abs-esc-systems',
    title: 'ABS & Electronic Stability Control (ESC)',
    difficulty: 'Intermediate',
    duration: '2.5 Hours',
    category: 'Core Systems',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    description: 'How wheel speed sensors, yaw rate sensors, and hydraulic modulators keep the car on the road.',
    content: `
### Anti-Lock Braking System (ABS)
ABS prevents the wheels from locking up during hard braking, allowing the driver to maintain steering control. It relies on:
- **Wheel Speed Sensors (WSS):** Hall-effect or inductive sensors on each wheel hub.
- **Hydraulic Control Unit (HCU):** Contains valves and a pump to rapidly apply and release brake fluid pressure to individual wheels (up to 15 times per second).

### Electronic Stability Control (ESC)
ESC (also known as ESP or VDC) builds upon ABS to prevent skidding or spin-outs during cornering. It adds two critical sensors:
- **Steering Angle Sensor (SAS):** Tells the computer where the driver *wants* to go.
- **Yaw Rate / Lateral G Sensor:** Tells the computer where the car is *actually* going.

If the car is oversteering (spinning out), ESC will automatically apply the outside front brake to pull the car back in line. If it\'s understeering (plowing forward), it applies the inside rear brake.
    `,
    tools_recommended: [],
    service_available: true
  },
  {
    id: 'steering-eps',
    title: 'Electronic Power Steering (EPS)',
    difficulty: 'Intermediate',
    duration: '2 Hours',
    category: 'Core Systems',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop',
    description: 'Replacing hydraulic fluid with electric motors. Torque sensors, assist maps, and calibration.',
    content: `
### How EPS Works
Electronic Power Steering (EPS) has entirely replaced hydraulic steering in modern cars. It saves fuel (no parasitic engine pump) and allows for ADAS features like Lane Keeping Assist.

An EPS system consists of:
- **Torque Sensor:** Located on the steering column. It measures how hard the driver is turning the wheel.
- **EPS Control Module:** Calculates how much assist is needed based on torque input and vehicle speed (more assist at 10km/h, less assist at 100km/h).
- **Electric Motor:** Usually mounted on the steering column or directly on the steering rack, providing the physical turning force.

### Calibration and Diagnostics
If an EPS rack or steering angle sensor is replaced, a "Zero Point Calibration" must be performed using a scan tool. This tells the computer exactly what "straight ahead" is. Without it, the steering wheel might pull to one side or disable the ESC system.
    `,
    tools_recommended: [],
    service_available: true
  },
  {
    id: 'can-bus-mastery',
    title: 'CAN Bus & Network Communication',
    difficulty: 'Advanced',
    duration: '4 Hours',
    category: 'Networking',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    description: 'Deep dive into Controller Area Network (CAN), frame structures, arbitration, and diagnosing bus faults.',
    content: `
### What is CAN Bus?
The Controller Area Network (CAN) is a robust vehicle bus standard designed to allow microcontrollers and devices to communicate with each other\'s applications without a host computer.

### Technical Deep Dive: Frame Structure
A standard CAN frame consists of several key fields:
- **SOF (Start of Frame):** 1 dominant bit indicating the start.
- **Identifier:** 11 bits (Standard CAN) or 29 bits (Extended CAN) establishing message priority. Lower ID = Higher Priority (Arbitration).
- **RTR (Remote Transmission Request):** Identifies if it\'s a data frame or a request for data.
- **DLC (Data Length Code):** 4 bits indicating the number of bytes in the data field (0-8 bytes).
- **Data Field:** Up to 8 bytes of actual payload.
- **CRC (Cyclic Redundancy Check):** 15 bits for error detection.

### Diagnostics & Troubleshooting
Common CAN faults include:
- **CAN High / CAN Low Short to Ground/Power:** Measure resistance across pins 6 and 14 on the OBD-II port. A healthy terminating resistance is exactly 60 Ohms (two 120 Ohm resistors in parallel).
- **Bus Off State:** When a node detects too many errors, it disconnects itself to prevent bringing down the entire network.

Using an oscilloscope, a healthy CAN signal will mirror CAN-H and CAN-L. CAN-H pulses from 2.5V to 3.5V, while CAN-L drops from 2.5V to 1.5V.
    `,
    tools_recommended: [
      { id: 't_001', name: '2-Channel Automotive Oscilloscope', price: 24500, image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=400&auto=format&fit=crop' },
      { id: 't_002', name: 'CAN Bus Analyzer / Sniffer', price: 12999, image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=400&auto=format&fit=crop' }
    ],
    service_available: true
  },
  {
    id: 'ecu-tuning-calibration',
    title: 'ECU Calibration & Tuning Concepts',
    difficulty: 'Expert',
    duration: '6 Hours',
    category: 'Software & Tuning',
    image: 'https://images.unsplash.com/photo-1555664424-778d1e573bf3?q=80&w=1200&auto=format&fit=crop',
    description: 'Understand Volumetric Efficiency (VE), Ignition Timing, Fuel Maps, and how to safely modify ECU parameters.',
    content: `
### The Fundamentals of ECU Tuning
Engine Control Unit (ECU) tuning involves modifying the software (maps) that dictate how the engine operates. The primary goals are usually increasing horsepower, improving fuel economy, or accommodating aftermarket hardware.

### Key Tuning Maps
- **Volumetric Efficiency (VE) Map:** Represents the engine\'s pumping efficiency at various RPMs and Load states. It dictates the base fuel mass calculation.
- **Ignition Timing Map (Spark Advance):** Determines when the spark plug fires relative to Top Dead Center (TDC). Advancing timing increases power but risks detonation (knock).
- **Target Air/Fuel Ratio (AFR):** Stoichiometric is 14.7:1 for gasoline. Tuners often target richer mixtures (e.g., 11.5:1 to 12.5:1) under high load/boost to prevent detonation and cool the combustion chamber.

### Flashing Methods
- **OBD-II Flashing:** The most common method today. A cable connects to the OBD-II port to read/write the flash memory.
- **Bench Flashing:** Removing the ECU from the car and connecting directly to its pins. Often required to bypass anti-tuning protection (Tuning Prot).
- **Boot Mode / BDM:** Opening the ECU casing to connect directly to the circuit board via specialized probes.
    `,
    tools_recommended: [
      { id: 't_003', name: 'KESSv2 Master OBD Flasher', price: 45000, image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?q=80&w=400&auto=format&fit=crop' },
      { id: 't_004', name: 'Tactrix OpenPort 2.0 Cable', price: 16500, image: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?q=80&w=400&auto=format&fit=crop' }
    ],
    service_available: true
  },
  {
    id: 'obd-uds-diagnostics',
    title: 'OBD-II, UDS & Laptop Diagnostics',
    difficulty: 'Intermediate',
    duration: '3 Hours',
    category: 'Diagnostics',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
    description: 'Learn the differences between Global OBD-II and OEM-specific UDS (Unified Diagnostic Services).',
    content: `
### Global OBD-II
Introduced in 1996, OBD-II is a standardized diagnostic protocol focusing purely on emissions-related systems. It defines standard DTCs (Diagnostic Trouble Codes).

### UDS (Unified Diagnostic Services - ISO 14229)
While OBD-II is mandated by law for emissions, OEMs use UDS for deep, module-level diagnostics (ABS, Airbags, Body Control Modules). UDS allows for:
- **Service $22:** Read Data By Identifier.
- **Service $2E:** Write Data By Identifier (Coding, VIN writing).
- **Service $31:** Routine Control (Actuations).

### Laptop-Based Diagnostics
Professional mechanics use laptop-based software (like VCDS for VW/Audi, ISTA for BMW) connected via an ENET, J2534, or proprietary cable. These tools utilize UDS to perform advanced functions like Key Programming, Injector Coding, and DPF Regeneration, which standard handheld OBD-II scanners cannot do.
    `,
    tools_recommended: [
      { id: 't_005', name: 'J2534 Pass-Thru Diagnostic VCI', price: 32000, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop' },
      { id: 't_006', name: 'Professional Bi-Directional OBD2 Scanner', price: 28500, image: 'https://images.unsplash.com/photo-1599256621730-535171e28f87?q=80&w=400&auto=format&fit=crop' }
    ],
    service_available: true
  },
  {
    id: 'adas-systems',
    title: 'ADAS (Advanced Driver Assistance Systems)',
    difficulty: 'Advanced',
    duration: '4 Hours',
    category: 'Next-Gen Tech',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop',
    description: 'Radar, LiDAR, Cameras, and the complex calibration required after windshield replacement or collision.',
    content: `
### Components of ADAS
- **Millimeter Wave Radar:** Used for Adaptive Cruise Control (ACC) and Automatic Emergency Braking (AEB).
- **LiDAR:** Uses lasers to map a high-res 3D point cloud of the surroundings.
- **Stereo Cameras:** Used for Lane Departure Warning and Traffic Sign Recognition.

### The Importance of Calibration
Any time a vehicle undergoes wheel alignment, windshield replacement, or suspension repair, the ADAS sensors MUST be recalibrated.

### Static vs Dynamic Calibration
- **Static Calibration:** Requires a controlled environment and physical targets.
- **Dynamic Calibration:** Initiated via a scan tool, requires driving on clearly marked roads.
    `,
    tools_recommended: [
      { id: 't_007', name: 'ADAS Static Calibration Target Frame', price: 150000, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop' }
    ],
    service_available: false
  },
  {
    id: 'ev-bms-architecture',
    title: 'EV Powertrains & Battery Management Systems (BMS)',
    difficulty: 'Expert',
    duration: '5 Hours',
    category: 'Next-Gen Tech',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop',
    description: 'High voltage safety, Lithium-ion cell balancing, and the role of the BMS in thermal runaway prevention.',
    content: `
### High Voltage Architecture
Modern EVs operate at 400V to 800V. Safety is paramount. Technicians must wear Class 0 (1000V rated) insulated gloves and strictly follow the Manufacturer\'s High Voltage Disable Procedure.

### Battery Management System (BMS)
The BMS is the brain of the battery pack. Its primary functions are:
- **State of Charge (SOC) Estimation**
- **Cell Balancing:** Active and Passive.
- **Thermal Management:** Preventing Thermal Runaway.

### Motor Controllers (Inverters)
The Inverter converts High Voltage DC from the battery into 3-Phase AC to drive the traction motor.
    `,
    tools_recommended: [
      { id: 't_008', name: '1000V Insulated Safety Glove Kit', price: 8500, image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=400&auto=format&fit=crop' },
      { id: 't_009', name: 'High Voltage Insulation Multimeter / Megohmmeter', price: 42000, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&auto=format&fit=crop' }
    ],
    service_available: true
  }
];
