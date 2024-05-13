import { HOME_PATH } from "@/paths";
import { Button, Result } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageHeader from "../shared/page-header/Pageheader";


export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("translation");

  const backHome = () => {
    navigate(HOME_PATH);
  }

  useEffect(() => {
    document.title = "Lỗi hệ thống | FRAGILE";
  }, []);
  
  return (
    <>
      <PageHeader isContainTitle={false} />
      <Result
        status="500"
        title={t("errors.500.title")}
        subTitle={t("errors.500.sub_title")}
        extra={
          <Button type="primary" onClick={backHome}>
            {t("errors.500.btn_back")}
          </Button>
        }
      />
    </>
  );
};
