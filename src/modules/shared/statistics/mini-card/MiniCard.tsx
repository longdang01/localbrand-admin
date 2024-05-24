import { Card, Skeleton, Statistic, Typography } from 'antd';
import classes from './mini-card.module.scss';
import { DotChartOutlined } from '@ant-design/icons';

interface Props {
    title?: string;
    value?: number;
    cardClass?: string;
    loading?: boolean;
}

const MiniCard = ({ title, value, cardClass, loading=true}: Props) => {
    return (
        <>
            {loading ? (
                <div className={classes.loadingContainer}>
                    <Skeleton.Node active={loading} style={{ height: 168}}>
                        <DotChartOutlined
                            style={{ fontSize: 90, color: '#bfbfbf' }}
                        />
                    </Skeleton.Node>
                </div>
            ) : (
                <Card bordered={false} className={`${cardClass}`}>
                    <Statistic
                        title={
                            <Typography.Text className={classes.title}>
                                {title}
                            </Typography.Text>
                        }
                        value={value}
                        className={`${classes.card}`}
                    />
                </Card>
            )}
        </>
    );
};

export default MiniCard;
