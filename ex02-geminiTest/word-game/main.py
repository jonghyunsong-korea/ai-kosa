def print_gugudan(dan):
    """주어진 단(dan)에 대한 구구단을 출력합니다."""
    print(f"--- {dan}단 ---")
    for i in range(1, 10):
        result = dan * i
        print(f"{dan} x {i} = {result}")

# 실행 부분
if __name__ == "__main__":
    # 7단을 출력하도록 함수 호출
    print_gugudan(7)