import { ProductColorsProps } from '@/models/product-color';
import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
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
import { useTranslation } from 'react-i18next';
import classes from '../../scss/product.module.scss';
import FormItem from 'antd/es/form/FormItem';
import { RULES_FORM } from '@/utils/validator';
import {
    useCreateDiscount,
    useRemoveDiscount,
    useUpdateDiscount,
} from '@/loaders/discount.loader';
import { queryClient } from '@/lib/react-query';
import { useState } from 'react';
import { CACHE_COLOR, useGetByIdColor } from '@/loaders/color.loader';
import {
    DeleteOutlined,
    EditOutlined,
    PercentageOutlined,
    PlusOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import { ProductDiscountProps } from '@/models/product-discount';
import { DISCOUNT_SYMBOLS } from '../../constants/product.constants';

interface Props {
    choosedColor?: ProductColorsProps;
}

const { useToken } = theme;

const ProductDiscounts = ({ choosedColor }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const { isOpen, open, close } = useDisclosure();
    const { token } = useToken();
    const [form] = useForm();
    const [choosedDiscount, setChoosedDiscount] =
        useState<ProductDiscountProps>();

    const currentColor = useGetByIdColor({
        id: choosedColor?._id || '',
        config: {
            onSuccess: () => {},
            onError: (error: any) => {
                form.resetFields();

                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: isOpen,
    });

    const createDiscount = useCreateDiscount({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_COLOR.GET_BY_ID]);

                notification.success({
                    message: t('product.create_success'),
                });

                handleRefresh();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const updateDiscount = useUpdateDiscount({
        id: choosedDiscount?._id || '',
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_COLOR.GET_BY_ID]);

                notification.success({
                    message: t('product.update_success'),
                });

                handleRefresh();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const deleteDiscount = useRemoveDiscount({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_COLOR.GET_BY_ID]);

                notification.success({
                    message: t('product.delete_success'),
                });

                handleRefresh?.();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const handleRefresh = () => {
        form.resetFields();
        setChoosedDiscount(undefined);
    };

    const handleOpen = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const handleChoosedDiscount = (discount: ProductDiscountProps) => {
        setChoosedDiscount(discount);
        form.setFieldsValue({ ...discount });
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                if (choosedDiscount?._id) {
                    updateDiscount.mutate({
                        ...values,
                        color: currentColor?.data?._id,
                    });
                } else {
                    createDiscount.mutate({
                        ...values,
                        color: currentColor?.data?._id,
                    });
                }
            })
            .catch(() => {
                notification.warning({
                    message: t('product.validate_form'),
                });
            });
    };

    const handleDelete = () => {
        deleteDiscount.mutate(choosedDiscount?._id || '');
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={
                    <Typography.Text>{t('product.discount')}</Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('product.discount')}>
                        <Button
                            shape="circle"
                            icon={<PercentageOutlined />}
                            onClick={handleOpen}
                            style={{ marginLeft: 15 }}
                            disabled={!choosedColor?._id}
                        />
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
                hideOkButton
            >
                {currentColor?.isLoading ? (
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
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={12} lg={12}>
                            <Form form={form}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.discount_name')}
                                    name="discountName"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('product.discount_name')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.discount_value')}
                                    name="value"
                                    rules={[
                                        ...RULES_FORM.number,
                                        ...RULES_FORM.required,
                                    ]}
                                >
                                    <Input
                                        placeholder={t(
                                            'product.discount_value',
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.discount_symbol')}
                                    name="symbol"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        options={DISCOUNT_SYMBOLS}
                                        placeholder={t(
                                            'product.discount_symbol',
                                        )}
                                    />
                                </FormItem>
                            </Form>

                            <Flex align="center" justify="end">
                                {!currentColor?.data?.discount ? (
                                    <Tooltip
                                        title={t('product.create_discount')}
                                    >
                                        <Button
                                            loading={createDiscount?.isLoading}
                                            type="primary"
                                            shape="circle"
                                            icon={<PlusOutlined />}
                                            onClick={handleSubmit}
                                            style={{ marginLeft: 10 }}
                                            disabled={!!choosedDiscount?._id}
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip
                                        title={t('product.update_discount')}
                                    >
                                        <Button
                                            loading={updateDiscount?.isLoading}
                                            type="primary"
                                            shape="circle"
                                            icon={<EditOutlined />}
                                            onClick={handleSubmit}
                                            style={{ marginLeft: 10 }}
                                            disabled={!choosedDiscount?._id}
                                        />
                                    </Tooltip>
                                )}
                                <ConfirmRender
                                    buttonRender={
                                        <Tooltip
                                            title={t('product.delete_discount')}
                                        >
                                            <Button
                                                loading={
                                                    deleteDiscount?.isLoading
                                                }
                                                shape="circle"
                                                icon={<DeleteOutlined />}
                                                className="btn-delete"
                                                style={{ marginLeft: 10 }}
                                                disabled={!choosedDiscount?._id}
                                            />
                                        </Tooltip>
                                    }
                                    handleConfirm={() => handleDelete()}
                                    content={t(
                                        'product.confirm_delete_discount',
                                    )}
                                    title={t('product.confirm_delete_title')}
                                />

                                <Tooltip title={t('product.refresh')}>
                                    <Button
                                        shape="circle"
                                        icon={<ReloadOutlined />}
                                        onClick={() => handleRefresh()}
                                        style={{ marginLeft: 10 }}
                                        className="btn-refresh"
                                    />
                                </Tooltip>
                            </Flex>
                        </Col>
                        <Col span={24} md={12} lg={12}>
                            {!currentColor?.data?.discount ? (
                                <>({t('product.empty_discount')})</>
                            ) : (
                                currentColor?.data?.discount && (
                                    <Tooltip
                                        title={
                                            currentColor?.data?.discount
                                                ?.discountName
                                        }
                                    >
                                        <Button
                                            className={classes.item}
                                            onClick={() =>
                                                handleChoosedDiscount(
                                                    currentColor?.data
                                                        ?.discount,
                                                )
                                            }
                                        >
                                            {
                                                currentColor?.data?.discount
                                                    ?.discountName
                                            }
                                        </Button>
                                    </Tooltip>
                                )
                            )}
                        </Col>
                    </Row>
                )}
            </ModalRender>
        </>
    );
};

export default ProductDiscounts;
