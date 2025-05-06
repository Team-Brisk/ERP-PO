'use client'
import { Box, Button, Card, Divider, Modal } from "@mui/material";
import { useRef } from "react";

interface Props {
    isOpen: boolean,
    onClose: () => void
}

export default function AddQueueCSV(props: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDivClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log(file);

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            console.log(text);
        }
    };

    return (
        <Modal className="modal" open={props.isOpen}>
            <Box className="w-[600px]">
                <Card className="w-full flex flex-col gap-2 p-4">
                    <h1 className="text-2xl text-black font-extralight pt-4">เพิ่มคิวงานด้วยไฟล์</h1>
                    <Divider></Divider>
                    <div className="w-full mt-2 flex flex-col gap-2">
                        <div onClick={() => { handleDivClick() }}
                            className="w-full h-[250px] flex justify-center items-center cursor-pointer text-gray-400 hover:text-gray-500
                        bg-gray-100 hover:bg-gray-200 rounded-md border-[3px] border-gray-200 hover:border-gray-400 border-dashed duration-300">
                            <span className="text-xl">
                                เพิ่มไฟล์ (.csv)
                            </span>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept=".csv"
                        />
                    </div>
                    <div className="w-full flex justify-end items-center gap-2 mt-6">
                        <Button
                            size='large'
                            variant='outlined'
                            color='error'
                            onClick={props.onClose}
                        >
                            ยกเลิก
                        </Button>
                    </div>
                </Card>
            </Box>
        </Modal>
    );
}