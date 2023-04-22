import { Button, Tag } from "antd";
import Form from "antd/lib/form";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FieldAgreementCheckbox } from "../../components/FormFields/Fields";
import { UserFormErrors } from "../../services/user.service";
import { formItemLayout, tailFormItemLayout } from "../SignIn/SignIn.styles";

const Container = styled.div`
    height: calc(100vh - 170px - 112px);
    overflow: auto;
    border: 2px solid;
    padding: 10px 20px;
    border-radius: 3px;
`;

const NoticeContainer = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
`;

type FormData = {
    agreement_terms_conditions: boolean;
};

type Props = {
    onFinish: (setErrors: (errors: UserFormErrors | undefined) => void) => Promise<void>;
    onReturn: () => void;
};

export const TermsConditionsStep: React.FC<Props> = props => {
    const [form] = Form.useForm<FormData>();

    const [scrolledToEnd, setScrolledToEnd] = useState(false);
    const [submitEnabled, setSubmitEnabled] = useState(false);

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!scrollContainerRef.current) return;

        const { scrollHeight, clientHeight } = scrollContainerRef.current;

        if (scrollHeight > clientHeight) return;

        setScrolledToEnd(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

            if (scrollTop + clientHeight === scrollHeight) {
                setScrolledToEnd(true);
            }
        }
    };

    const onFinish = async () => {
        setLoading(true);

        await props.onFinish(errors => {
            if (!errors) {
                return;
            }

            // @ts-ignore
            setError(Object.keys(errors).map(key => errors?.[key]?.[0] as string)[0]);
        });

        setLoading(false);
    };

    const onValuesChange = (data: FormData) => {
        setSubmitEnabled(scrolledToEnd && data.agreement_terms_conditions);
    };

    return (
        <div>
            <NoticeContainer>
                <Tag color="volcano">You will be allowed to Sign Up after you read the Terms and Conditions</Tag>
            </NoticeContainer>

            <Container ref={scrollContainerRef} onScroll={onScroll}>
                <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum."
                </p>
                <br />
                <p>Абзац 1.10.32 "de Finibus Bonorum et Malorum", написанный Цицероном в 45 году н.э.</p>
                <p>
                    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                    dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                    sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
                    est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius
                    modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
                    veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
                    commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
                    molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                </p>
                <br />
                <p>Английский перевод 1914 года, H. Rackham</p>
                <p>
                    "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was
                    born and I will give you a complete account of the system, and expound the actual teachings of the
                    great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or
                    avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue
                    pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who
                    loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally
                    circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial
                    example, which of us ever undertakes laborious physical exercise, except to obtain some advantage
                    from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no
                    annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
                </p>
                <br />
                <p>Абзац 1.10.33 "de Finibus Bonorum et Malorum", написанный Цицероном в 45 году н.э.</p>
                <p>
                    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                    deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                    provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum
                    fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis
                    est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis
                    voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis
                    aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non
                    recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus
                    maiores alias consequatur aut perferendis doloribus asperiores repellat."
                </p>
                <br />
                <p>Английский перевод 1914 года, H. Rackham</p>
                <p>
                    "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and
                    demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee
                    the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their
                    duty through weakness of will, which is the same as saying through shrinking from toil and pain.
                    These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice
                    is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is
                    to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty
                    or the obligations of business it will frequently occur that pleasures have to be repudiated and
                    annoyances accepted. The wise man therefore always holds in these matters to this principle of
                    selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid
                    worse pains."
                </p>
            </Container>

            <Form
                {...formItemLayout}
                form={form}
                labelWrap={true}
                name="register_terms_conditional"
                onFinish={onFinish}
                onValuesChange={onValuesChange}
            >
                <FieldAgreementCheckbox disabled={!scrolledToEnd} link="/" name="agreement_terms_conditions">
                    I have read and agree to Terms and Conditions
                </FieldAgreementCheckbox>

                {error && (
                    <NoticeContainer>
                        <Tag color="volcano">{error}</Tag>
                    </NoticeContainer>
                )}

                <Form.Item {...tailFormItemLayout}>
                    <Button
                        disabled={!submitEnabled || Boolean(error)}
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                    >
                        Sign Up
                    </Button>{" "}
                    <Button disabled={isLoading} type="primary" onClick={props.onReturn}>
                        Return to the form
                    </Button>{" "}
                    <Button type="primary">
                        <Link to="/login">Back to Login</Link>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
