import { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { ColumnsType, ColumnType, FilterDropdownProps } from "antd/lib/table/interface";
import Highlighter from "react-highlight-words";
import { Button, Input, Space } from "antd";

export type Columns<T extends {}> = (
    getColumnSearchProps: (key: keyof T, label: string) => ColumnType<T>
) => ColumnsType<T>;

export const useAdvancedFeaturesTable = <T extends {}>(columns: Columns<T>) => {
    const [state, setState] = useState<{
        searchText: React.Key;
        searchedColumn: string;
    }>({
        searchText: "",
        searchedColumn: ""
    });

    const searchInput = useRef<HTMLInputElement | null>(null);

    const handleSearch = (
        selectedKeys: FilterDropdownProps["selectedKeys"],
        confirm: FilterDropdownProps["confirm"],
        dataIndex: string
    ) => {
        confirm();
        setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex
        });
    };

    const handleReset = (clearFilters: FilterDropdownProps["clearFilters"]) => {
        if (clearFilters) clearFilters();
        setState(state => ({ ...state, searchText: "" }));
    };

    const getColumnSearchProps: (dataIndex: keyof T, label: string) => ColumnType<T> = (dataIndex, label) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    // @ts-ignore
                    ref={searchInput}
                    placeholder={`Search ${label}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, String(dataIndex))}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, String(dataIndex))}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined, fontSize: 16 }} />,
        onFilter: (value, record) => {
            return record[dataIndex]
                ? String(record[dataIndex]).toLowerCase().includes(value.toString().toLowerCase())
                : false;
        },
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: text =>
            state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[state.searchText.toString()]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            )
    });

    return columns(getColumnSearchProps);
};
