! function (a) {
	"use strict";
	a.fn.modalSteps = function (b) {
		var c = this,
			d = a.extend({
				btnCancelHtml: "취소",
				btnPreviousHtml: "이전",
				btnNextHtml: "다음",
				btnLastStepHtml: "완료",
				disableNextButton: !1,
				completeCallback: function () {},
				callbacks: {},
				getTitleAndStep: function () {}
			}, b),
			e = function () {
				var a = d.callbacks["*"];
				if (void 0 !== a && "function" != typeof a) throw "everyStepCallback is not a function! I need a function";
				if ("function" != typeof d.completeCallback) throw "completeCallback is not a function! I need a function";
				for (var b in d.callbacks)
					if (d.callbacks.hasOwnProperty(b)) {
						var c = d.callbacks[b];
						if ("*" !== b && void 0 !== c && "function" != typeof c) throw "Step " + b + " callback must be a function"
					}
			},
			f = function (a) {
				return void 0 !== a && "function" == typeof a && (a(), !0)
			};
		return c.on("show.bs.modal", function () {
			var l, m, n, o, p, b = c.find(".modal-footer"),
				g = b.find(".js-btn-step[data-orientation=cancel]"),
				h = b.find(".js-btn-step[data-orientation=previous]"),
				i = b.find(".js-btn-step[data-orientation=next]"),
				j = d.callbacks["*"],
				k = d.callbacks[1];
			d.disableNextButton && i.attr("disabled", "disabled"), h.attr("disabled", "disabled"), e(), f(j), f(k), g.html(d.btnCancelHtml), h.html(d.btnPreviousHtml), i.html(d.btnNextHtml), m = a("<input>").attr({
				type: "hidden",
				id: "actual-step",
				value: "1"
			}), c.find("#actual-step").remove(), c.append(m), l = 1, p = l + 1, c.find("[data-step=" + l + "]").removeClass("hide"), i.attr("data-step", p), n = c.find("[data-step=" + l + "]").data("title"), o = a("<span>").addClass("label label-success").html(l), c.find(".js-title-step").append(o).append(" " + n), d.getTitleAndStep(m.attr("data-title"), l)
		}).on("hidden.bs.modal", function () {
			var a = c.find("#actual-step"),
				b = c.find(".js-btn-step[data-orientation=next]");
			c.find("[data-step]").not(c.find(".js-btn-step")).addClass("hide"), a.not(c.find(".js-btn-step")).remove(), b.attr("data-step", 1).html(d.btnNextHtml), c.find(".js-title-step").html("")
		}), c.find(".js-btn-step").on("click", function () {
			var m, n, o, p, b = a(this),
				e = c.find("#actual-step"),
				g = c.find(".js-btn-step[data-orientation=previous]"),
				h = c.find(".js-btn-step[data-orientation=next]"),
				i = c.find(".js-title-step"),
				j = b.data("orientation"),
				k = parseInt(e.val()),
				l = d.callbacks["*"];
			if (m = c.find("div[data-step]").length, "complete" === b.attr("data-step")) return d.completeCallback(), void c.modal("hide");
			if ("next" === j) n = k + 1, g.attr("data-step", k), e.val(n);
			else {
				if ("previous" !== j) return void c.modal("hide");
				n = k - 1, h.attr("data-step", k), g.attr("data-step", n - 1), e.val(k - 1)
			}
			parseInt(e.val()) === m ? h.attr("data-step", "complete").html(d.btnLastStepHtml) : h.attr("data-step", n).html(d.btnNextHtml), d.disableNextButton && h.attr("disabled", "disabled"), c.find("[data-step=" + k + "]").not(c.find(".js-btn-step")).addClass("hide"), c.find("[data-step=" + n + "]").not(c.find(".js-btn-step")).removeClass("hide"), parseInt(g.attr("data-step")) > 0 ? g.removeAttr("disabled") : g.attr("disabled", "disabled"), "previous" === j && h.removeAttr("disabled"), o = c.find("[data-step=" + n + "]"), o.attr("data-unlock-continue") && h.removeAttr("disabled"), p = o.attr("data-title");
			var q = a("<span>").addClass("label label-success").html(n);
			i.html(q).append(" " + p), d.getTitleAndStep(o.attr("data-title"), n);
			var r = d.callbacks[e.val()];
			f(l), f(r)
		}), this
	}
}(jQuery);
