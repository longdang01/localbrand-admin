import { useGetByIdProduct } from '@/loaders/product.loader';
import { OrderDetailProps } from '@/models/order-detail';
import { ProductProps } from '@/models/product';
import { ProductColorsProps } from '@/models/product-color';
import { ProductSizeProps } from '@/models/product-size';
import ModalRender from '@/modules/shared/modal/ModalRender';
import { useOrderDetailState } from '@/stores/order-detail.store';
import { useDisclosure } from '@/utils/modal';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Select,
    Tooltip,
    Typography,
    notification,
    theme,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const { useToken } = theme;

interface Props {
    id?: string;
    orderDetail?: OrderDetailProps;
}

const EditProductModal = ({ id, orderDetail }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'sell' });
    const { isOpen, open, close } = useDisclosure();
    const { token } = useToken();

    const [form] = useForm();
    const [orderDetails, setOrderDetails] = useOrderDetailState(
        (state) => [state.orderDetails, state.setOrderDetails],
    );
    const [choosedColor, setChoosedColor] = useState<ProductColorsProps>();
    const [choosedSize, setChoosedSize] = useState<ProductSizeProps>();

    const currentProduct = useGetByIdProduct({
        id: id || '',
        config: {
            onSuccess: (response) => {
                
                form.setFieldsValue({
                    ...response,
                    ...orderDetail,
                });
                setChoosedColor(orderDetail?.color as ProductColorsProps);
                setChoosedSize(orderDetail?.size as ProductSizeProps);
               
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: isOpen,
    });

    const handleOpen = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const handleChoosedColor = (e: any) => {
        const color = currentProduct?.data?.colors?.find(
            (color: ProductColorsProps) => color?._id == e,
        );

        form.setFieldValue('color_id', e);
        setChoosedColor(color);
        setChoosedSize(undefined);
        form.setFieldValue('size_id', null);
    };

    const handleChoosedSize = (e: any) => {
        form.setFieldValue('size_id', e);
        
        setChoosedSize(
            choosedColor?.sizes?.find(
                (size: ProductSizeProps) => size?._id == e,
            ),
        );
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                const checkExisted = orderDetails?.filter((d:OrderDetailProps) => 
                    ((d?.product as ProductProps)?._id != (orderDetail?.product as ProductProps)?._id || 
                    (d?.color as ProductColorsProps)?._id != (orderDetail?.color as ProductColorsProps)?._id || 
                    (d?.size as ProductSizeProps)?._id != (orderDetail?.size as ProductSizeProps)?._id )
                )?.find((orderDetail:OrderDetailProps) => 
                    (orderDetail?.product as ProductProps)?._id == currentProduct?.data?._id && 
                    (orderDetail?.color as ProductColorsProps)?._id == choosedColor?._id && 
                    (orderDetail?.size as ProductSizeProps)?._id == choosedSize?._id
                ) 

                if(
                    checkExisted 
                ) {
                    notification.warning({
                        message: t('order.create_product_warning'),
                    });
                    return;
                }

                if(choosedSize && (values?.quantity > choosedSize?.quantity)) {
                    notification.warning({
                        message: t('order.quantity_product_warning'),
                    });
                    return;
                }

                const details = orderDetails?.map(
                    (d: OrderDetailProps) =>
                        ((d?.product as ProductProps)?._id ==
                            (orderDetail?.product as ProductProps)?._id &&
                        (d?.color as ProductColorsProps)?._id ==
                            (orderDetail?.color as ProductColorsProps)?._id &&
                        (d?.size as ProductSizeProps)?._id ==
                            (orderDetail?.size as ProductSizeProps)?._id) ? {
                            ...d,
                            ...values,
                            color: choosedColor,
                            size: choosedSize
                        } : {...d},
                );

                setOrderDetails(details);
                handleClose?.();
            })
            .catch(() => {
                notification.warning({
                    message: t('product.validate_form'),
                });
            });
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={
                    <Typography.Text>
                        {t('order.product_info')}
                    </Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('product.update')}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleOpen}
                        />
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
            >
                {currentProduct?.isLoading ? (
                    <Flex
                        align="center"
                        justify="center"
                        style={{ height: '100%' }}
                    >
                        <div
                            className="loader"
                            style={{ background: token.colorPrimary }}
                        ></div>
                    </Flex>
                ) : (
                    <Form form={form} layout="vertical">
                        <FormItem
                            labelCol={{ span: 7 }}
                            name="productName"
                            label={t('order.fields.product')}
                            rules={[...RULES_FORM.required]}
                        >
                            <Input
                                placeholder={t('order.fields.product')}
                                readOnly
                            />
                        </FormItem>
                        <Row gutter={24}>
                            <Col span={24} md={12} lg={12}>
                                <Row>
                                    <Col span={22} md={22} lg={22}>
                                        <FormItem
                                            labelCol={{ span: 7 }}
                                            label={t('order.fields.color')}
                                            name="color_id"
                                            rules={[...RULES_FORM.required]}
                                        >
                                            <Select
                                                onSelect={handleChoosedColor}
                                                options={currentProduct?.data?.colors?.map(
                                                    (
                                                        color: ProductColorsProps,
                                                    ) => ({
                                                        label: color?.colorName,
                                                        value: color?._id,
                                                    }),
                                                )}
                                                placeholder={t(
                                                    'order.fields.color',
                                                )}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={2} md={2} lg={2}>
                                        <Flex style={{ height: "100%"}} align='end' justify="end">
                                            <Button
                                                type="text"
                                                style={{
                                                    backgroundColor:
                                                        choosedColor?.hex,
                                                    border: '1px solid #d6d6d6',
                                                    marginBottom: 24
                                                }}
                                            />
                                        </Flex>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24} md={12} lg={12}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('order.fields.size')}
                                    name="size_id"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        onSelect={handleChoosedSize}
                                        options={choosedColor?.sizes?.map(
                                            (size: ProductSizeProps) => ({
                                                label: size?.sizeName,
                                                value: size?._id,
                                            }),
                                        )}
                                        placeholder={t('order.fields.size')}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={24} md={12} lg={12}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={`${t('order.fields.quantity')} (${choosedSize?.quantity || 0})`}
                                    name="quantity"
                                    rules={[
                                        ...RULES_FORM.required,
                                        ...RULES_FORM.number,
                                    ]}
                                >
                                    <Input
                                        placeholder={t(
                                            'order.fields.quantity',
                                        )}
                                        style={{ width: '100%' }}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={24} md={12} lg={12}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('order.fields.price')}
                                    name="price"
                                    rules={[
                                        ...RULES_FORM.required,
                                        ...RULES_FORM.number,
                                    ]}
                                >
                                    <Input
                                        placeholder={t(
                                            'order.fields.price',
                                        )}
                                        style={{ width: '100%' }}
                                        readOnly
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                )}
            </ModalRender>
        </>
    );
};

export default EditProductModal;
