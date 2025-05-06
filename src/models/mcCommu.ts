
export type MachineStatusType = 'crane' | 'inverter'

export interface MachineStatusRes {
    id: number
    site_id: number
    code_no: string
    code_alarm: string
    desc_en: string
    desc_th: string
}

type AlarmCode = 'Code Alarm Main'
    | 'Code Alarm แกน X'
    | 'Code Alarm แกน Y'
    | 'Code Alarm แกน Z1 (Slide)'
    | 'Code Alram แกน Z2 (Press/Unpress)'
    | 'Code Alarm รุนแรง'

interface CodeDescription {
    code: string
    description: string
}

interface DesOption {
    type: AlarmCode
    color?: string
    codeDescription: Array<CodeDescription>
}

interface McCode {
    name: string
    data: {
        position: string | Array<string>
        codeDescription: Array<CodeDescription> | Array<DesOption>
    }
}

export const mcMacchine: Array<McCode> = [
    {
        name: 'Pregram Step',
        data: {
            position: 'D147',
            codeDescription: [
                { code: '0', description: 'จอด' },
                { code: '1', description: 'ทำงาน : เลื่อนชุดอาร์มเข้าเพื่อเตรียมตัวเคลื่อนที่' },
                { code: '2', description: 'ทำงาน : เคลื่อนที่ไปตำแหน่งต้นทาง' },
                { code: '3', description: 'ทำงาน : เลื่อนชุดอาร์มออกเพื่อหนีบห่ออวน' },
                { code: '4', description: 'ทำงาน : หนีบห่ออวน' },
                { code: '5', description: 'ทำงาน : ยกห่ออวนที่หนีบขึ้น' },
                { code: '6', description: 'ทำงาน : เลื่อนชุดอาร์มที่หนีบห่ออวนเข้า' },
                { code: '7', description: 'ทำงาน : เคลื่อนที่ไปตำแหน่งปลายทาง' },
                { code: '8', description: 'ทำงาน : เลื่อนชุดอาร์มออกเพื่อวางห่ออวน' },
                { code: '9', description: 'ทำงาน : วางห่ออวน' },
                { code: '10', description: 'ทำงาน : ปล่อยห่ออวนที่หนีบออก' },
                { code: '11', description: 'ทำงาน : เลื่อนชุดอาร์มเข้าเพื่อจบการทำงาน' },
                { code: '12', description: 'ทำงาน : คลายห่ออวน (หนีบแน่นเกินไป)' },
                { code: '21', description: 'ทำงาน : เลื่อนชุดอาร์มเข้าเพื่อเตรียมตัวเคลื่อนที่' },
                { code: '22', description: 'ทำงาน : เคลื่อนที่กลับตำแหน่งถาดพักสินค้า' },
                { code: '100', description: 'ทำงาน : ตรวจสอบคำสั่งจากคอมพิวเตอร์' },
            ],
        },
    },
    {
        name: 'Command',
        data: {
            position: 'D148',
            codeDescription: [
                { code: '0', description: 'หยุดทำงาน' },
                { code: '1', description: 'เริ่มทำงาน (คำสั่งใหม่)' },
                { code: '2', description: 'กลับ Home' },
                { code: '3', description: 'เริ่มทำงาน (คำสั่งล่าสุด)' }
            ]
        }
    },
    {
        name: 'Alarm Code',
        data: {
            position: 'D149',
            codeDescription: [
                {
                    type: 'Code Alarm Main',
                    codeDescription: [
                        { code: '0', description: 'ปกติ' },
                        { code: '1', description: 'มีการต่อสาย Manual Switch' },
                        { code: '3', description: 'ไม่มีสิ่งของบนกระเช้า 1' },
                        { code: '4', description: 'มีสิ่งของค้างบนกระเช้า 1' },
                        { code: '5', description: 'ไม่มีสิ่งของบนชั้นวางสินค้า' },
                        { code: '6', description: 'ชั้นวางสินค้าไม่ว่าง' },
                        { code: '7', description: 'มีสิ่งของค้างปลาย Arm' },
                        { code: '8', description: 'มีสิ่งของขวางทางแกน Slide' },
                        { code: '9', description: 'ขนาดห่อสินค้า คลาดเคลื่อนเกินค่าที่กำหนด' },
                        { code: '10', description: 'Main EM.Sw.' },
                        { code: '12', description: 'สินค้า เกินขนาดที่กำหนด 1 (เสา Swing)' },
                        { code: '13', description: 'ไม่มีสิ่งของบนกระเช้า 2' },
                        { code: '14', description: 'มีสิ่งของค้างบนกระเช้า 2' },
                        { code: '15', description: 'ไม่มีสิ่งของบนกระเช้า 1 และ 2' },
                        { code: '16', description: 'มีสิ่งของค้างบนกระเช้า 1 และ 2' },
                        { code: '17', description: 'คำสั่งผิดพลาด ข้อมูลไม่ครบ' },
                        { code: '18', description: 'คำสั่งผิดพลาด ข้อมูลเกินช่วงที่กำหนด' },
                        { code: '19', description: 'คำสั่งผิดพลาด ไม่มีการเลือกใช้งาน Arm / ทำงานเสร็จหมดแล้ว' }
                    ]
                },
                {
                    type: 'Code Alarm แกน X',
                    codeDescription: [
                        { code: '20', description: 'EM. Sw. แกน X' },
                        { code: '21', description: 'Sensor Stop Home แกน X ทำงาน' },
                        { code: '22', description: 'Sensor Stop End แกน X ทำงาน' },
                        { code: '23', description: 'Sensor Stop แกน X มีปัญหา' },
                        { code: '24', description: 'สัญญาณ Distance Sensor เป็น 0' },
                        { code: '25', description: 'ตำแหน่งจริง Distance Sensor น้อยผิดปกติ' },
                        { code: '26', description: 'ตำแหน่งจริง Distance Sensor มากผิดปกติ' },
                        { code: '27', description: 'คำสั่งระยะทาง น้อยผิดปกติ' },
                        { code: '28', description: 'คำสั่งระยะทาง มากผิดปกติ' },
                        { code: '29', description: 'ระยะทาง ผิดพลาด (Jump)' },
                        { code: '30', description: 'ระยะทาง ผิดพลาด (Not Change)' },
                        { code: '31', description: 'จอดไม่ตรงตำแหน่ง (ผิดพลาดมากกว่า 10 มม.)' }
                    ]
                },
                {
                    type: 'Code Alarm แกน Y',
                    codeDescription: [
                        { code: '40', description: 'EM. Sw. แกน Y' },
                        { code: '41', description: 'Sensor Min แกน Y ทำงาน' },
                        { code: '42', description: 'Sensor Max แกน Y ทำงาน' },
                        { code: '43', description: 'Sensor แกน Y มีปัญหา' },
                        { code: '44', description: 'สัญญาณ Distance Sensor เป็น 0' },
                        { code: '45', description: 'ตำแหน่งจริง Distance Sensor น้อยผิดปกติ' },
                        { code: '46', description: 'ตำแหน่งจริง Distance Sensor มากผิดปกติ' },
                        { code: '47', description: 'คำสั่งระยะทาง น้อยผิดปกติ' },
                        { code: '48', description: 'คำสั่งระยะทาง มากผิดปกติ' },
                        { code: '49', description: 'ระยะ ยก/วาง ผิดปกติ' },
                        { code: '51', description: 'ระยะทาง ผิดพลาด (Jump)' },
                        { code: '52', description: 'ระยะทาง ผิดพลาด (Not Change)' },
                        { code: '53', description: 'จอดไม่ตรงตำแหน่ง (ผิดพลาดมากกว่า 5 มม.)' }
                    ]
                },
                {
                    type: 'Code Alarm แกน Z1 (Slide)',
                    codeDescription: [
                        { code: '60', description: 'EM. Sw. แกน Z1' },
                        { code: '61', description: 'ระบบ Slide เกินเวลาที่กำหนด (10 วินาที)' },
                        { code: '62', description: 'Sensor ระบบ Slide Arm มีปัญหา' },
                        { code: '63', description: 'Arm 1 ไม่อยู่กลางกระเช้า' }
                    ]
                },
                {
                    type: 'Code Alram แกน Z2 (Press/Unpress)',
                    codeDescription: [
                        { code: '80', description: 'EM. Sw. แกน Z2' },
                        { code: '81', description: 'ระบบ Press/Unpress เกินเวลาที่กำหนด (10 วินาที)' },
                        { code: '82', description: 'Sensor ระบบ Slide Arm มีปัญหา' },
                        { code: '84', description: 'Arm 2 ไม่อยู่กลางกระเช้า' },
                        { code: '90', description: 'ขนาดห่อสินค้า เล็กผิดปกติ' },
                        { code: '91', description: 'ขนาดห่อสินค้า ใหญ่ผิดปกติ' }
                    ]
                },
                {
                    type: 'Code Alarm รุนแรง',
                    codeDescription: [
                        { code: '100', description: 'Limit โซ่ขาด' },
                        { code: '101', description: '(แกน X) Inverter มีปัญหา' },
                        { code: '102', description: '(แกน X) Limit Stop Home ทำงาน' },
                        { code: '103', description: '(แกน X) Limit Stop End ทำงาน' },
                        { code: '104', description: '(แกน X) Limit Stop มีปัญหา' },
                        { code: '105', description: '(แกน Y) Inverter มีปัญหา' },
                        { code: '106', description: '(แกน Y) Limit Stop Bottom ทำงาน' },
                        { code: '107', description: '(แกน Y) Limit Stop Top ทำงาน' },
                        { code: '108', description: '(แกน Y) Limit Stop มีปัญหา' },
                        { code: '109', description: '(แกน Z1) Inverter มีปัญหา' },
                        { code: '110', description: '(แกน Z2) Inverter มีปัญหา' }
                    ]
                }
            ]
        }
    }

];
const fetchMachines = async (): Promise<Array<McCode>> => {
    return mcMacchine; // Replace with an actual fetch function if needed
};
export const getDescription = async (
    position: string,
    code: string
): Promise<string | undefined> => {
    try {
        // จำลองการดึงข้อมูลแบบ async
        const machines = await fetchMachines(); // แทนที่ fetchMachines ด้วยฟังก์ชันที่เหมาะสม
        for (const machine of machines) {
            if (machine.data.position === position) {
                const { codeDescription } = machine.data;

                // Case 1: Flat array of CodeDescription
                if (Array.isArray(codeDescription) && codeDescription.every((item) => 'code' in item)) {
                    for (const desc of codeDescription as Array<CodeDescription>) {
                        if (desc.code === code) {
                            return desc.description;
                        }
                    }
                }

                // Case 2: Nested array of DesOption
                if (Array.isArray(codeDescription) && codeDescription.every((item) => 'type' in item)) {
                    for (const option of codeDescription as Array<DesOption>) {
                        for (const desc of option.codeDescription) {
                            if (desc.code === code) {
                                return desc.description;
                            }
                        }
                    }
                }
            }
        }

        return undefined; // No match found
    } catch (error) {
        console.error("Error fetching machine descriptions:", error);
        return undefined;
    }
};

