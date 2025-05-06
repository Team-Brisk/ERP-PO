"use client";
import { Company } from "@/models/company";
import "../../styles/tailwind.css";
import { useEffect, useState } from "react";
import axios from '@/app/config/axiosConfig';
import { Credential } from "@/models/users";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Site } from "@/models/site";
import { BASE_API } from "@/app/(main)/api";
import SiteRender from "./ui/SiteRender";
import AddSiteModal from "./components/_AddSiteModal";
import { useStoreData } from "@/app/hooks/useStoreData";

export default function siteCOnfiguration() {

  const setPageTitle = useStoreData((state) => state.setPageTitle)

  const [credential, setCredential] = useState<Credential>();
  const [companyData, setCompanyData] = useState<Array<Company>>([]);
  const [selectCompany, setSelectCompany] = useState<number>(0);

  const [siteData, setSiteData] = useState<Array<Site>>([]);

  const [isOpenAddSite, setIsOpenAddSite] = useState<boolean>(false);
  // const [isOpenUpdateSite, setIsOpenUpdateSite] = useState<boolean>(false)

  useEffect(() => {
    setPageTitle('ตั้งค่าไซต์งาน')
    document.title = 'ตั้งค่าไซต์งาน'
    const data = JSON.parse(localStorage.getItem("Credential")!) as Credential;
    setCredential(data);
    getCompanyByUser(data.userData.user_id);
  }, []);

  useEffect(() => {
    if (selectCompany == 0) {
      getSite();
    } else {
      setSiteData([]);
    }
  }, [selectCompany]);

  const getSite = async () => {
    try {
      const res = await axios.post(`${BASE_API}/get_site_by_company`, {
        companyId: 1,
      });
      setSiteData(res.data.siteData);
    } catch (err) {
      console.log(err);
    }
  };

  const getCompanyByUser = async (id: number) => {
    try {
      const res = await axios.get(`${BASE_API}/get_companies`);
      setCompanyData(res.data.company_data);
    } catch (err) {
      console.log(err);
    }
  };

  const renderCompanyData = () => {
    return (
      <FormControl className="w-1/2 lg:w-1/3 relative bg-white">
        {/* <InputLabel id="company-select-label">Company</InputLabel> */}
        {/* <Select
          size='small'
          id="company-select-label"
          label="Company"
          labelId="company-select-label"
          className="w-full"
          value={selectCompany}
          onChange={(e) => {
            if (e.target.value !== null) {
              setSelectCompany(Number(e.target.value));
            } else {
              setSelectCompany(0);
            }
          }}
        >
          {companyData.map((c) => (
            <MenuItem value={c.company_id} key={c.company_id}>
              {c.company_name}
            </MenuItem>
          ))}
        </Select>
        {selectCompany === 0 && (
          <span className="absolute -bottom-6 pt-2 px-1 text-sm text-orange">
            โปรดเลือกบริษัทเพื่อแสดงไซต์งาน
          </span>
        )} */}
      </FormControl>
    );
  };
  return (

    <div className="text-black">
      <div className="min-h-full ">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-row gap-2">
            {renderCompanyData()}
            {selectCompany !== 0 && (
              <button
                onClick={() => setIsOpenAddSite(true)}
                className="btn-minimal text-blue-500 rounded-md px-4 py-2"
              >
                Add Site
              </button>
            )}
          </div>
          <div>
            <SiteRender
              onUpdate={() => {
                getSite();
              }}
              siteData={siteData}
            ></SiteRender>
            {credential && (
              <AddSiteModal
                userId={credential.userData.user_id}
                companyId={selectCompany}
                isOpen={isOpenAddSite}
                onClose={() => setIsOpenAddSite(false)}
                onUpdate={() => {
                  getSite();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
