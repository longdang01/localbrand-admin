import { DASHBOARD_PATH } from "@/paths";
import { Button, Result } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageHeader from "../shared/page-header/Pageheader";


export const NotAuthorizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("translation");

  const backHome = () => {
    navigate(DASHBOARD_PATH);
  }

  useEffect(() => {
    document.title = "Không có quyền truy cập | FRAGILE CLUB";
  }, []);

  return (
    <>
      <PageHeader isContainTitle={false} />
      <Result
        status="403"
        title={t("errors.403.title")}
        subTitle={t("errors.403.sub_title")}
        extra={
          <Button type="primary" onClick={backHome}>
            {t("errors.403.btn_back")}
          </Button>
        }
      />
    </>
  );
};
