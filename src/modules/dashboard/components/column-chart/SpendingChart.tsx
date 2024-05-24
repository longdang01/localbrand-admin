import { useGetTotalSpending } from '@/loaders/statistics.loader';
import { Column } from '@ant-design/plots';
import classes from '../../scss/dashboard.module.scss';
import { Spin, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { BarChartOutlined } from '@ant-design/icons';

const { useToken } = theme;

const SpendingChart = () => {
    const { t } = useTranslation("translation", { keyPrefix: "dashboard" })
    const { token } = useToken();
    const getSpendingChart = useGetTotalSpending({});

    const config: any = {
        data: getSpendingChart?.data?.sort((a:any, b:any) => a.month - b.month).map(
            (record:any) => ({...record, month: String(record?.month)})
        ),
        xField: 'month',
        yField: 'result',
        seriesField: 'month',
        // legend: {
        //   padding: [8, 0, 32, 0],
        //   show: false,
        // },
        legend: false,
        label: {
            position: 'middle',
            // 'top', 'bottom', 'middle'
            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
            content: (record: any) => record.result.toLocaleString(),
        },
        tooltip: {
            formatter: (record:any) => ({
                name: record.month,
                value: record?.result?.toLocaleString(),
            }),
        },
    };

    return (
        <>
            <div className={classes.chartContainer}
            style={{ border: `1px solid ${token.colorBorder}`}}>
                <Typography.Text className={classes.chartHeader}
                    style={{ color: token.colorPrimary}}
                >
                    <BarChartOutlined />
                    {t('column_chart.spending')}
                </Typography.Text>

                {getSpendingChart?.isLoading ? (
                    <div className={classes.spinContainer}>
                        <Spin />
                    </div>
                ) : (
                    <Column {...config} />
                )}
            </div>
        </>
    );
};

export default SpendingChart;
